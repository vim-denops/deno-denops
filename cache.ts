// deno-lint-ignore no-explicit-any
const that = globalThis as any;

// Thread-local cache
that.denopsCache = {};

/**
 * Get a value from the thread-local context
 */
export function getCache<T = unknown>(name: string): T | undefined {
  return that.denopsCache[name];
}

/**
 * Set a value to the thread-local cache
 */
export function setCache<T>(name: string, value: T): void {
  that.denopsCache[name] = value;
}

/**
 * Get a value from the thread-local cache or set if no value exist
 */
export function getCacheOrElse<T>(name: string, factory: () => T): T {
  if (!that.denopsCache[name]) {
    that.denopsCache[name] = factory();
  }
  return that.denopsCache[name];
}
