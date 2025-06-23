/**
 * @internal
 * A utility type to get the type of a value at a direct key or an array element type.
 */
type GetValue<T, P extends string> = P extends `${infer K}[${string}]`
  ? K extends keyof T
    ? T[K] extends (infer U)[]
      ? U
      : never
    : never
  : P extends keyof T
    ? T[P]
    : never;

/**
 * @internal
 * A utility type that recursively traverses an object T using a dot-notation path P to find the type of the value at that path.
 * Supports nested objects and arrays.
 * @example
 * type User = { address: { city: string } };
 * type CityType = ValueByPath<User, "$.address.city">; // string
 */
export type ValueByPath<T, P extends string> = P extends `$.${infer Rest}`
  ? ValueByPath<T, Rest>
  : P extends `${infer K}.${infer Rest}`
    ? ValueByPath<GetValue<T, K>, Rest>
    : GetValue<T, P>;

/**
 * @internal
 * A utility type that generates all possible dot-notation paths for a given object type T.
 */
type Paths<T, Prefix extends string = ''> = T extends object
  ? {
      [K in keyof T & string]: T[K] extends (infer U)[]
        ? `${Prefix}${K}` | `${Prefix}${K}[${number}]` | Paths<U, `${Prefix}${K}[${number}].`>
        : T[K] extends object
          ? `${Prefix}${K}` | Paths<T[K], `${Prefix}${K}.`>
          : `${Prefix}${K}`;
    }[keyof T & string]
  : never;

/**
 * Creates a union of all possible dot-notation paths for a given object type T, prefixed with `$.`.
 * This provides type safety and autocompletion for condition keys.
 * @example
 * type User = { name: string; address: { city: string } };
 * type UserPaths = ObjectPaths<User>; // "$.name" | "$.address" | "$.address.city"
 */
export type ObjectPaths<T> = `$.${Paths<T>}`;
