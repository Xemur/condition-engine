/**
 * Operators that can be used for any type.
 */
export const COMMON_OPERATORS = ['eq', 'neq'] as const;
export type CommonOperator = (typeof COMMON_OPERATORS)[number];

/**
 * Operators that are only valid for non-array types (string, number, boolean).
 */
export const NON_ARRAY_OPERATORS = ['lt', 'lte', 'gt', 'gte'] as const;
export type NonArrayOperator = (typeof NON_ARRAY_OPERATORS)[number];

/**
 * Operators that are only valid for array types.
 */
export const ARRAY_OPERATORS = [
  'in',
  'nin',
  'hasSize',
  'containsAny',
  'containsAll',
  'contains',
] as const;
export type ArrayOperator = (typeof ARRAY_OPERATORS)[number];

/**
 * A comprehensive list of all valid operators in the engine.
 */
export const OPERATORS = [...COMMON_OPERATORS, ...NON_ARRAY_OPERATORS, ...ARRAY_OPERATORS] as const;
export type Operator = (typeof OPERATORS)[number];
