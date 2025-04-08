import {
  ConditionSchema,
  UntypedCondition,
  Condition,
} from "../types";
import { evaluateCondition } from "./evaluate";
import { ConditionParsingError } from "../errors";

/**
 * Parses an unknown condition object using Zod and then evaluates it against an object.
 * This is useful for handling conditions from external sources like a database or API,
 * where the structure is not guaranteed to be type-safe.
 * @template T The type of the object to evaluate against.
 * @param object The object to evaluate the condition against.
 * @param untypedCondition The raw, unknown condition object to parse and evaluate.
 * @returns `true` if the parsed condition is met, `false` otherwise.
 * @throws {ConditionParsingError} If the `untypedCondition` does not match the ConditionSchema.
 */
export const parseAndEvaluate = <T>(
  object: T,
  untypedCondition: unknown
): boolean => {
  const parseResult = ConditionSchema.safeParse(untypedCondition);
  if (!parseResult.success) {
    throw new ConditionParsingError(
      `Invalid condition format: ${parseResult.error.message}`
    );
  }
  return evaluateCondition(
    object,
    parseResult.data as UntypedCondition as Condition<T>
  );
}; 