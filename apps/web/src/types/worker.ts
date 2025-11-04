import type { MatchCtx, TransformResult } from '@css-windify/core';

/**
 * Result from transformCssText with bySelector
 */
export interface CssTransformResult {
  bySelector: Record<string, TransformResult>;
}

/**
 * Message sent from main thread to worker
 */
export interface WorkerMessage {
  type: 'transform';
  id: string;
  payload: {
    css: string;
    options: MatchCtx;
  };
}

/**
 * Response sent from worker to main thread
 */
export interface WorkerResponse {
  type: 'success' | 'error';
  id: string;
  payload: CssTransformResult | WorkerError;
}

/**
 * Error object returned by worker
 */
export interface WorkerError {
  message: string;
  stack?: string;
  name: string;
}

/**
 * Worker state
 */
export type WorkerState = 'idle' | 'processing' | 'success' | 'error';

/**
 * Result from useWorker hook
 */
export interface UseWorkerResult {
  state: WorkerState;
  result: CssTransformResult | null;
  error: WorkerError | null;
  transform: (css: string, options: MatchCtx) => Promise<CssTransformResult>;
  cancel: () => void;
  reset: () => void;
}
