/**
 * Plugin registry for managing plugins
 */

import {
  Plugin,
  PluginRegistryOptions,
  PropertyHandler,
  BeforeTransformContext,
  AfterTransformContext,
  BeforeMatchContext,
  AfterMatchContext,
} from './types';

/**
 * Plugin registry class
 */
export class PluginRegistry {
  private plugins: Map<string, Plugin> = new Map();
  private options: PluginRegistryOptions;

  constructor(options: PluginRegistryOptions = {}) {
    this.options = {
      allowDuplicates: false,
      enableHooks: true,
      ...options,
    };
  }

  /**
   * Register a plugin
   */
  async register(plugin: Plugin): Promise<void> {
    const { name } = plugin.metadata;

    // Check for duplicates
    if (!this.options.allowDuplicates && this.plugins.has(name)) {
      throw new Error(`Plugin "${name}" is already registered`);
    }

    // Initialize plugin
    if (plugin.init) {
      await plugin.init();
    }

    this.plugins.set(name, plugin);
  }

  /**
   * Unregister a plugin
   */
  async unregister(name: string): Promise<boolean> {
    const plugin = this.plugins.get(name);
    if (!plugin) {
      return false;
    }

    // Cleanup plugin
    if (plugin.destroy) {
      await plugin.destroy();
    }

    return this.plugins.delete(name);
  }

  /**
   * Get a plugin by name
   */
  get(name: string): Plugin | undefined {
    return this.plugins.get(name);
  }

  /**
   * Check if a plugin is registered
   */
  has(name: string): boolean {
    return this.plugins.has(name);
  }

  /**
   * Get all registered plugins
   */
  getAll(): Plugin[] {
    return Array.from(this.plugins.values());
  }

  /**
   * Get all plugin names
   */
  getNames(): string[] {
    return Array.from(this.plugins.keys());
  }

  /**
   * Clear all plugins
   */
  async clear(): Promise<void> {
    for (const plugin of this.plugins.values()) {
      if (plugin.destroy) {
        await plugin.destroy();
      }
    }
    this.plugins.clear();
  }

  /**
   * Get all custom handlers from plugins
   */
  getHandlers(): Record<string, PropertyHandler> {
    const handlers: Record<string, PropertyHandler> = {};

    for (const plugin of this.plugins.values()) {
      if (plugin.handlers) {
        Object.assign(handlers, plugin.handlers);
      }
    }

    return handlers;
  }

  /**
   * Execute beforeTransform hooks
   */
  async executeBeforeTransform(context: BeforeTransformContext): Promise<void> {
    if (!this.options.enableHooks) return;

    for (const plugin of this.plugins.values()) {
      if (plugin.hooks?.beforeTransform) {
        await plugin.hooks.beforeTransform(context);
      }
    }
  }

  /**
   * Execute afterTransform hooks
   */
  async executeAfterTransform(context: AfterTransformContext): Promise<void> {
    if (!this.options.enableHooks) return;

    for (const plugin of this.plugins.values()) {
      if (plugin.hooks?.afterTransform) {
        await plugin.hooks.afterTransform(context);
      }
    }
  }

  /**
   * Execute beforeMatch hooks
   */
  async executeBeforeMatch(context: BeforeMatchContext): Promise<void> {
    if (!this.options.enableHooks) return;

    for (const plugin of this.plugins.values()) {
      if (plugin.hooks?.beforeMatch) {
        await plugin.hooks.beforeMatch(context);
      }
    }
  }

  /**
   * Execute afterMatch hooks
   */
  async executeAfterMatch(context: AfterMatchContext): Promise<void> {
    if (!this.options.enableHooks) return;

    for (const plugin of this.plugins.values()) {
      if (plugin.hooks?.afterMatch) {
        await plugin.hooks.afterMatch(context);
      }
    }
  }

  /**
   * Get plugin count
   */
  get count(): number {
    return this.plugins.size;
  }
}

/**
 * Global plugin registry instance
 */
export const globalRegistry = new PluginRegistry();
