import { z } from 'zod';
import { OPERATORS } from '../operators';
import type { BaseLogicalCondition } from './conditions';

/**
 * The Zod schema for a single, untyped atomic condition. Used for parsing and validation.
 */
export const AtomicConditionSchema = z.object({
  key: z.string(),
  op: z.enum(OPERATORS),
  value: z.any(),
});

/**
 * @internal
 * The base Zod schema for a single atomic condition.
 */
export const BaseAtomicCondition = AtomicConditionSchema;

/**
 * @internal
 * The base type for a single atomic condition, inferred from the Zod schema.
 */
export type BaseAtomicCondition = z.infer<typeof BaseAtomicCondition>;

/**
 * @internal
 * The recursive Zod schema for a logical condition.
 */
export const BaseLogicalConditionSchema: z.ZodType<BaseLogicalCondition> = z.lazy(() =>
  z.object({
    logic: z.enum(['and', 'or']),
    conditions: z.array(z.union([BaseAtomicCondition, z.lazy(() => BaseLogicalConditionSchema)])),
  }),
);

/**
 * The Zod schema for any condition (atomic or logical). Useful for parsing untyped inputs.
 */
export const ConditionSchema = z.union([BaseAtomicCondition, BaseLogicalConditionSchema]);

/**
 * Represents a condition that has not yet been type-checked, inferred from the base Zod schema.
 */
export type UntypedCondition = z.infer<typeof ConditionSchema>;
