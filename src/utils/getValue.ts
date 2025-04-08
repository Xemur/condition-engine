/**
 * Retrieves a nested value from an object using a dot-notation path.
 * Supports simple paths, nested paths, and array indexing.
 * @param obj The object to retrieve the value from.
 * @param path The dot-notation path to the value (e.g., "$.user.posts[0].title").
 * @returns The value at the specified path, or `undefined` if not found.
 */
export const getValue = (obj: any, path: string): any => {
  const segments = (path.startsWith("$.") ? path.slice(2) : path)
    .replace(/\[(\d+)\]/g, ".$1")
    .split(".");
  return segments.reduce(
    (acc, segment) => (acc ? acc[segment] : undefined),
    obj
  );
}; 