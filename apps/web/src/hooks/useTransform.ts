import { useState, useCallback, useRef } from 'react';
import type { MatchCtx } from '@css-windify/core';
import type {
  WorkerError,
  WorkerState,
  UseWorkerResult,
  CssTransformResult,
} from '../types/worker';

/**
 * React hook for managing CSS transformation via API
 * Replaces Web Worker with server-side processing
 */
export function useTransform(): UseWorkerResult {
  const [state, setState] = useState<WorkerState>('idle');
  const [result, setResult] = useState<CssTransformResult | null>(null);
  const [error, setError] = useState<WorkerError | null>(null);

  const abortControllerRef = useRef<AbortController | null>(null);

  /**
   * Transform CSS using the API
   */
  const transform = useCallback(
    async (css: string, options: MatchCtx): Promise<CssTransformResult> => {
      // Cancel any pending request
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      // Create new abort controller
      abortControllerRef.current = new AbortController();

      // Set processing state
      setState('processing');
      setError(null);
      setResult(null);

      try {
        const response = await fetch('/api/transform', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ css, options }),
          signal: abortControllerRef.current.signal,
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to transform CSS');
        }

        const transformResult = await response.json();

        setState('success');
        setResult(transformResult);
        setError(null);

        return transformResult;
      } catch (err) {
        if (err instanceof Error && err.name === 'AbortError') {
          const abortError: WorkerError = {
            name: 'TransformCancelled',
            message: 'Transform operation was cancelled',
          };
          setState('error');
          setError(abortError);
          throw abortError;
        }

        const transformError: WorkerError = {
          name: err instanceof Error ? err.name : 'TransformError',
          message: err instanceof Error ? err.message : 'Unknown error',
          stack: err instanceof Error ? err.stack : undefined,
        };

        setState('error');
        setError(transformError);
        throw transformError;
      }
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
    setState('idle');
  }, []);

  /**
   * Reset state
   */
  const reset = useCallback(() => {
    setState('idle');
    setResult(null);
    setError(null);
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
