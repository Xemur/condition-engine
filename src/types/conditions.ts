import { ObjectPaths, ValueByPath } from './paths';
import type { BaseAtomicCondition } from './schemas';
import { CommonOperator, NonArrayOperator, ArrayOperator } from '../operators';

/**
 * @internal
 * The base interface for a logical condition, used for building the recursive Zod schema.
 */
export interface BaseLogicalCondition {
  logic: 'and' | 'or';
  conditions: Array<BaseAtomicCondition | BaseLogicalCondition>;
}

type NonArrayCondition<T, P extends ObjectPaths<T>> = {
  op: NonArrayOperator | CommonOperator;
  value: ValueByPath<T, P>;
};

type ArrayCondition<T, P extends ObjectPaths<T>> =
  | {
      op: CommonOperator;
      value: ValueByPath<T, P>;
    }
  | {
      op: Extract<ArrayOperator, 'in' | 'nin' | 'contains'>;
      value: ValueByPath<T, P> extends (infer U)[] ? U : never;
    }
  | {
      op: Extract<ArrayOperator, 'hasSize'>;
      value: number;
    }
  | {
      op: Extract<ArrayOperator, 'containsAny' | 'containsAll'>;
      value: ValueByPath<T, P>;
    };

/**
 * Represents a single, atomic condition with full type safety.
 * The `value` property's type is inferred from the `key` property.
 * @template T The type of the object being evaluated.
 * @template P The specific path within the object.
 */
export type AtomicCondition<T, P extends ObjectPaths<T> = ObjectPaths<T>> = {
  key: P;
} & (ValueByPath<T, P> extends any[] ? ArrayCondition<T, P> : NonArrayCondition<T, P>);

/**
 * Represents a logical condition (`and` / `or`) that groups other conditions.
 * @template T The type of the object being evaluated.
 */
export interface LogicalCondition<T> {
  logic: 'and' | 'or';
  conditions: Array<Condition<T>>;
}

/**
 * Represents a complete condition, which can be either a type-safe atomic condition or a logical condition.
 * @template T The type of the object being evaluated.
 */
export type Condition<T> =
  | { [P in ObjectPaths<T>]: AtomicCondition<T, P> }[ObjectPaths<T>]
  | LogicalCondition<T>;
