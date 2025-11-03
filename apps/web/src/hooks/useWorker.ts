import { useEffect, useRef, useState, useCallback } from 'react';
import type { MatchCtx, TransformResult } from '@css-windify/core';
import type {
  WorkerMessage,
  WorkerResponse,
  WorkerError,
  WorkerState,
  UseWorkerResult,
} from '../types/worker';

/**
 * React hook for managing Web Worker communication
 * Handles CSS transformation in a separate thread to avoid blocking the UI
 */
export function useWorker(): UseWorkerResult {
  const [state, setState] = useState<WorkerState>('idle');
  const [result, setResult] = useState<TransformResult | null>(null);
  const [error, setError] = useState<WorkerError | null>(null);

  const workerRef = useRef<Worker | null>(null);
  const pendingRequestRef = useRef<string | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  /**
   * Initialize worker on mount
   */
  useEffect(() => {
    // Create worker instance
    workerRef.current = new Worker(new URL('../worker.ts', import.meta.url), {
      type: 'module',
    });

    // Handle messages from worker
    workerRef.current.onmessage = (event: MessageEvent<WorkerResponse>) => {
      const { type, id, payload } = event.data;

      // Ignore responses from cancelled requests
      if (id !== pendingRequestRef.current) {
        return;
      }

      if (type === 'success') {
        setState('success');
        setResult(payload as TransformResult);
        setError(null);
        pendingRequestRef.current = null;
      } else if (type === 'error') {
        setState('error');
        setError(payload as WorkerError);
        setResult(null);
        pendingRequestRef.current = null;
      }
    };

    // Handle worker errors
    workerRef.current.onerror = (event) => {
      console.error('Worker error:', event);
      setState('error');
      setError({
        name: 'WorkerError',
        message: event.message || 'Unknown worker error',
        stack: undefined,
      });
      pendingRequestRef.current = null;
    };

    // Cleanup on unmount
    return () => {
      if (workerRef.current) {
        workerRef.current.terminate();
        workerRef.current = null;
      }
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
        abortControllerRef.current = null;
      }
    };
  }, []);

  /**
   * Transform CSS using the worker
   */
  const transform = useCallback(
    async (css: string, options: MatchCtx): Promise<TransformResult> => {
      return new Promise((resolve, reject) => {
        if (!workerRef.current) {
          const error: WorkerError = {
            name: 'WorkerNotInitialized',
            message: 'Worker is not initialized',
          };
          setState('error');
          setError(error);
          reject(error);
          return;
        }

        // Cancel any pending request
        if (abortControllerRef.current) {
          abortControllerRef.current.abort();
        }

        // Create new abort controller
        abortControllerRef.current = new AbortController();
        const requestId = crypto.randomUUID();
        pendingRequestRef.current = requestId;

        // Set processing state
        setState('processing');
        setError(null);
        setResult(null);

        // Listen for abort
        abortControllerRef.current.signal.addEventListener('abort', () => {
          if (pendingRequestRef.current === requestId) {
            const error: WorkerError = {
              name: 'TransformCancelled',
              message: 'Transform operation was cancelled',
            };
            setState('error');
            setError(error);
            reject(error);
            pendingRequestRef.current = null;
          }
        });

        // Create message
        const message: WorkerMessage = {
          type: 'transform',
          id: requestId,
          payload: { css, options },
        };

        // Set up one-time message handler for this specific request
        const handleResponse = (event: MessageEvent<WorkerResponse>) => {
          const { type, id, payload } = event.data;

          if (id !== requestId) {
            return;
          }

          if (type === 'success') {
            resolve(payload as TransformResult);
          } else if (type === 'error') {
            reject(payload as WorkerError);
          }
        };

        workerRef.current.addEventListener('message', handleResponse, { once: true });

        // Send message to worker
        workerRef.current.postMessage(message);
      });
    },
    []
  );

  /**
   * Cancel current transformation
   */
  const cancel = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    pendingRequestRef.current = null;
    setState('idle');
  }, []);

  /**
   * Reset state
   */
  const reset = useCallback(() => {
    setState('idle');
    setResult(null);
    setError(null);
    pendingRequestRef.current = null;
  }, []);

  return {
    state,
    result,
    error,
    transform,
    cancel,
    reset,
  };
}
