/**
 * Plugin system for CSSWindify
 * Allows extending functionality with custom matchers and handlers
 */

export * from './types';
export * from './registry';

import { Plugin, PropertyHandler } from './types';
import { globalRegistry } from './registry';

/**
 * Create a simple plugin with custom handlers
 */
export function createPlugin(
  name: string,
  version: string,
  handlers: Record<string, PropertyHandler>,
  description?: string
): Plugin {
  return {
    metadata: {
      name,
      version,
      description,
    },
    handlers,
  };
}

/**
 * Register a plugin globally
 */
export async function registerPlugin(plugin: Plugin): Promise<void> {
  await globalRegistry.register(plugin);
}

/**
 * Unregister a plugin globally
 */
export async function unregisterPlugin(name: string): Promise<boolean> {
  return await globalRegistry.unregister(name);
}

/**
 * Get a plugin by name
 */
export function getPlugin(name: string): Plugin | undefined {
  return globalRegistry.get(name);
}

/**
 * Get all registered plugins
 */
export function getAllPlugins(): Plugin[] {
  return globalRegistry.getAll();
}

/**
 * Clear all plugins
 */
export async function clearPlugins(): Promise<void> {
  await globalRegistry.clear();
}

/**
 * Get custom handlers from all plugins
 */
export function getPluginHandlers(): Record<string, PropertyHandler> {
  return globalRegistry.getHandlers();
}
