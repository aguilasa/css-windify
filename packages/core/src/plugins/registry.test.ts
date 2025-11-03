import { describe, it, expect, beforeEach } from 'vitest';
import { PluginRegistry } from './registry';
import { Plugin } from './types';

describe('PluginRegistry', () => {
  let registry: PluginRegistry;

  beforeEach(() => {
    registry = new PluginRegistry();
  });

  describe('register', () => {
    it('should register a plugin', async () => {
      const plugin: Plugin = {
        metadata: {
          name: 'test-plugin',
          version: '1.0.0',
        },
      };

      await registry.register(plugin);

      expect(registry.has('test-plugin')).toBe(true);
      expect(registry.get('test-plugin')).toBe(plugin);
    });

    it('should call init when registering', async () => {
      let initCalled = false;

      const plugin: Plugin = {
        metadata: {
          name: 'test-plugin',
          version: '1.0.0',
        },
        init: async () => {
          initCalled = true;
        },
      };

      await registry.register(plugin);

      expect(initCalled).toBe(true);
    });

    it('should throw error on duplicate registration', async () => {
      const plugin: Plugin = {
        metadata: {
          name: 'test-plugin',
          version: '1.0.0',
        },
      };

      await registry.register(plugin);

      await expect(registry.register(plugin)).rejects.toThrow(
        'Plugin "test-plugin" is already registered'
      );
    });

    it('should allow duplicates when configured', async () => {
      const registryWithDuplicates = new PluginRegistry({ allowDuplicates: true });

      const plugin1: Plugin = {
        metadata: {
          name: 'test-plugin',
          version: '1.0.0',
        },
      };

      const plugin2: Plugin = {
        metadata: {
          name: 'test-plugin',
          version: '2.0.0',
        },
      };

      await registryWithDuplicates.register(plugin1);
      await registryWithDuplicates.register(plugin2);

      expect(registryWithDuplicates.get('test-plugin')).toBe(plugin2);
    });
  });

  describe('unregister', () => {
    it('should unregister a plugin', async () => {
      const plugin: Plugin = {
        metadata: {
          name: 'test-plugin',
          version: '1.0.0',
        },
      };

      await registry.register(plugin);
      const result = await registry.unregister('test-plugin');

      expect(result).toBe(true);
      expect(registry.has('test-plugin')).toBe(false);
    });

    it('should call destroy when unregistering', async () => {
      let destroyCalled = false;

      const plugin: Plugin = {
        metadata: {
          name: 'test-plugin',
          version: '1.0.0',
        },
        destroy: async () => {
          destroyCalled = true;
        },
      };

      await registry.register(plugin);
      await registry.unregister('test-plugin');

      expect(destroyCalled).toBe(true);
    });

    it('should return false for non-existent plugin', async () => {
      const result = await registry.unregister('non-existent');
      expect(result).toBe(false);
    });
  });

  describe('getAll', () => {
    it('should return all plugins', async () => {
      const plugin1: Plugin = {
        metadata: { name: 'plugin1', version: '1.0.0' },
      };

      const plugin2: Plugin = {
        metadata: { name: 'plugin2', version: '1.0.0' },
      };

      await registry.register(plugin1);
      await registry.register(plugin2);

      const plugins = registry.getAll();

      expect(plugins).toHaveLength(2);
      expect(plugins).toContain(plugin1);
      expect(plugins).toContain(plugin2);
    });
  });

  describe('getNames', () => {
    it('should return all plugin names', async () => {
      await registry.register({
        metadata: { name: 'plugin1', version: '1.0.0' },
      });

      await registry.register({
        metadata: { name: 'plugin2', version: '1.0.0' },
      });

      const names = registry.getNames();

      expect(names).toEqual(['plugin1', 'plugin2']);
    });
  });

  describe('clear', () => {
    it('should clear all plugins', async () => {
      await registry.register({
        metadata: { name: 'plugin1', version: '1.0.0' },
      });

      await registry.register({
        metadata: { name: 'plugin2', version: '1.0.0' },
      });

      await registry.clear();

      expect(registry.count).toBe(0);
    });

    it('should call destroy on all plugins', async () => {
      let destroy1Called = false;
      let destroy2Called = false;

      await registry.register({
        metadata: { name: 'plugin1', version: '1.0.0' },
        destroy: async () => {
          destroy1Called = true;
        },
      });

      await registry.register({
        metadata: { name: 'plugin2', version: '1.0.0' },
        destroy: async () => {
          destroy2Called = true;
        },
      });

      await registry.clear();

      expect(destroy1Called).toBe(true);
      expect(destroy2Called).toBe(true);
    });
  });

  describe('getHandlers', () => {
    it('should return all custom handlers', async () => {
      await registry.register({
        metadata: { name: 'plugin1', version: '1.0.0' },
        handlers: {
          'custom-prop1': () => 'class1',
        },
      });

      await registry.register({
        metadata: { name: 'plugin2', version: '1.0.0' },
        handlers: {
          'custom-prop2': () => 'class2',
        },
      });

      const handlers = registry.getHandlers();

      expect(handlers).toHaveProperty('custom-prop1');
      expect(handlers).toHaveProperty('custom-prop2');
      expect(handlers['custom-prop1']('value', {} as any)).toBe('class1');
      expect(handlers['custom-prop2']('value', {} as any)).toBe('class2');
    });
  });

  describe('lifecycle hooks', () => {
    it('should execute beforeTransform hooks', async () => {
      let hook1Called = false;
      let hook2Called = false;

      await registry.register({
        metadata: { name: 'plugin1', version: '1.0.0' },
        hooks: {
          beforeTransform: async () => {
            hook1Called = true;
          },
        },
      });

      await registry.register({
        metadata: { name: 'plugin2', version: '1.0.0' },
        hooks: {
          beforeTransform: async () => {
            hook2Called = true;
          },
        },
      });

      await registry.executeBeforeTransform({
        css: 'test',
        ctx: {} as any,
      });

      expect(hook1Called).toBe(true);
      expect(hook2Called).toBe(true);
    });

    it('should not execute hooks when disabled', async () => {
      const registryNoHooks = new PluginRegistry({ enableHooks: false });
      let hookCalled = false;

      await registryNoHooks.register({
        metadata: { name: 'plugin1', version: '1.0.0' },
        hooks: {
          beforeTransform: async () => {
            hookCalled = true;
          },
        },
      });

      await registryNoHooks.executeBeforeTransform({
        css: 'test',
        ctx: {} as any,
      });

      expect(hookCalled).toBe(false);
    });
  });

  describe('count', () => {
    it('should return plugin count', async () => {
      expect(registry.count).toBe(0);

      await registry.register({
        metadata: { name: 'plugin1', version: '1.0.0' },
      });

      expect(registry.count).toBe(1);

      await registry.register({
        metadata: { name: 'plugin2', version: '1.0.0' },
      });

      expect(registry.count).toBe(2);
    });
  });
});
