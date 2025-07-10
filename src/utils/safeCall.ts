export function safeCall<T>(
  value: unknown,
  action: string,
  args: unknown[] = [],
  defaultValue?: T,
): T | null {
  try {
    if (value === null || value === undefined) return defaultValue || null;

    const valueObj = typeof value !== 'object' ? Object(value) : value;

    if (action in valueObj) {
      const method = (valueObj as Record<string, unknown>)[action];
      if (typeof method === 'function') {
        return method.apply(valueObj, args) as T;
      }
    }
    return defaultValue || null;
  } catch {
    return defaultValue || null;
  }
}
