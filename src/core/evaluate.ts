import { getValue } from "../utils/getValue";
import { AtomicCondition, Condition, ObjectPaths } from "../types";

/**
 * Evaluates a single, type-safe atomic condition against an object.
 * @template T The type of the object to evaluate against.
 * @template P The type-safe path for the key in the condition.
 * @param object The object to evaluate the condition against.
 * @param condition The atomic condition to evaluate.
 * @returns `true` if the condition is met, `false` otherwise.
 */
export const evaluateAtomicCondition = <T, P extends ObjectPaths<T>>(
  object: T,
  condition: AtomicCondition<T, P>
): boolean => {
  const { key, op, value } = condition;
  const targetValue = getValue(object, key);

  switch (op) {
    case "eq":
      return targetValue === value;
    case "neq":
      return targetValue !== value;
    case "lt":
      return targetValue < value;
    case "lte":
      return targetValue <= value;
    case "gt":
      return targetValue > value;
    case "gte":
      return targetValue >= value;
    case "in":
    case "contains":
      return Array.isArray(targetValue) && targetValue.includes(value);
    case "nin":
      return !Array.isArray(targetValue) || !targetValue.includes(value);
    case "hasSize":
      return Array.isArray(targetValue) && targetValue.length === value;
    case "containsAny":
      return (
        Array.isArray(targetValue) &&
        Array.isArray(value) &&
        value.some((v) => targetValue.includes(v))
      );
    case "containsAll":
      return (
        Array.isArray(targetValue) &&
        Array.isArray(value) &&
        value.every((v) => targetValue.includes(v))
      );
    default:
      return false;
  }
};

/**
 * Evaluates a condition (either atomic or logical) against an object.
 * This is the main function for evaluating pre-defined, type-safe conditions.
 * @template T The type of the object to evaluate against.
 * @param object The object to evaluate the condition against.
 * @param condition The condition to evaluate.
 * @returns `true` if the condition is met, `false` otherwise.
 */
export const evaluateCondition = <T>(
  object: T,
  condition: Condition<T>
): boolean => {
  if ("logic" in condition) {
    const { logic, conditions } = condition;

    if (logic === "and") {
      return conditions.every((child) => evaluateCondition(object, child));
    }
    return conditions.some((child) => evaluateCondition(object, child));
  }
  return evaluateAtomicCondition(object, condition as AtomicCondition<T>);
}; 