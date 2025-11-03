/**
 * Plugin system types for CSSWindify
 * Allows extending functionality with custom matchers and handlers
 */

import { MatchCtx, TransformResult } from '../types';

/**
 * Plugin metadata
 */
export interface PluginMetadata {
  name: string;
  version: string;
  description?: string;
  author?: string;
}

/**
 * Custom property handler function
 */
export type PropertyHandler = (
  value: string,
  ctx: MatchCtx
) => string | string[] | { classes: string[]; warnings?: string[] };

/**
 * Lifecycle hook contexts
 */
export interface BeforeTransformContext {
  css: string;
  ctx: MatchCtx;
}

export interface AfterTransformContext {
  css: string;
  result: Record<string, TransformResult>;
  ctx: MatchCtx;
}

export interface BeforeMatchContext {
  property: string;
  value: string;
  ctx: MatchCtx;
}

export interface AfterMatchContext {
  property: string;
  value: string;
  result: string | string[];
  ctx: MatchCtx;
}

/**
 * Plugin lifecycle hooks
 */
export interface PluginHooks {
  /**
   * Called before CSS transformation starts
   */
  beforeTransform?: (context: BeforeTransformContext) => void | Promise<void>;

  /**
   * Called after CSS transformation completes
   */
  afterTransform?: (context: AfterTransformContext) => void | Promise<void>;

  /**
   * Called before a property is matched
   */
  beforeMatch?: (context: BeforeMatchContext) => void | Promise<void>;

  /**
   * Called after a property is matched
   */
  afterMatch?: (context: AfterMatchContext) => void | Promise<void>;
}

/**
 * Plugin interface
 */
export interface Plugin {
  /**
   * Plugin metadata
   */
  metadata: PluginMetadata;

  /**
   * Custom property handlers
   * Maps CSS property names to handler functions
   */
  handlers?: Record<string, PropertyHandler>;

  /**
   * Lifecycle hooks
   */
  hooks?: PluginHooks;

  /**
   * Plugin initialization
   * Called when the plugin is registered
   */
  init?: () => void | Promise<void>;

  /**
   * Plugin cleanup
   * Called when the plugin is unregistered
   */
  destroy?: () => void | Promise<void>;
}

/**
 * Plugin registry options
 */
export interface PluginRegistryOptions {
  /**
   * Allow multiple plugins with the same name
   */
  allowDuplicates?: boolean;

  /**
   * Enable plugin hooks
   */
  enableHooks?: boolean;
}
