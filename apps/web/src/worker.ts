/**
 * Web Worker for CSS to Tailwind transformation
 * Runs transformCssText in a separate thread to avoid blocking the UI
 */

import { transformCssText } from '@css-windify/core';
import type { WorkerMessage, WorkerResponse, WorkerError } from './types/worker';

/**
 * Handle incoming messages from the main thread
 */
self.onmessage = async (event: MessageEvent<WorkerMessage>) => {
  const { type, id, payload } = event.data;

  // Only handle 'transform' messages
  if (type !== 'transform') {
    const errorResponse: WorkerResponse = {
      type: 'error',
      id,
      payload: {
        name: 'InvalidMessageType',
        message: `Unknown message type: ${type}`,
      },
    };
    self.postMessage(errorResponse);
    return;
  }

  try {
    const { css, options } = payload;

    // Validate input
    if (typeof css !== 'string') {
      throw new Error('CSS must be a string');
    }

    if (!options || typeof options !== 'object') {
      throw new Error('Options must be an object');
    }

    // Transform CSS using the core library
    const result = transformCssText(css, options);

    // Send success response
    const successResponse: WorkerResponse = {
      type: 'success',
      id,
      payload: result,
    };

    self.postMessage(successResponse);
  } catch (error) {
    // Handle errors and send error response
    const workerError: WorkerError = {
      name: error instanceof Error ? error.name : 'UnknownError',
      message: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
    };

    const errorResponse: WorkerResponse = {
      type: 'error',
      id,
      payload: workerError,
    };

    self.postMessage(errorResponse);
  }
};

/**
 * Handle worker errors
 */
self.onerror = (event) => {
  console.error('Worker error:', event);
  const errorResponse: WorkerResponse = {
    type: 'error',
    id: 'unknown',
    payload: {
      name: 'WorkerError',
      message: event.message || 'Unknown worker error',
      stack: undefined,
    },
  };
  self.postMessage(errorResponse);
};

/**
 * Handle unhandled promise rejections
 */
self.onunhandledrejection = (event) => {
  console.error('Unhandled rejection in worker:', event.reason);
  const errorResponse: WorkerResponse = {
    type: 'error',
    id: 'unknown',
    payload: {
      name: 'UnhandledRejection',
      message: event.reason?.message || String(event.reason),
      stack: event.reason?.stack,
    },
  };
  self.postMessage(errorResponse);
};

export {};
