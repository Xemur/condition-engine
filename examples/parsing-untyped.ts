import { parseAndEvaluate, ConditionParsingError } from "../src";

const user = {
  name: "John Doe",
  age: 30,
  isVerified: true,
};

const untypedCondition = {
  logic: "and",
  conditions: [
    { key: "$.age", op: "gte", value: 21 },
    { key: "$.isVerified", op: "eq", value: true },
  ],
};

try {
  const result = parseAndEvaluate(user, untypedCondition);
  console.log(result); // true
} catch (e) {
  if (e instanceof Error) {
    console.error(e.message);
  }
}

const invalidUntypedCondition = {
  logic: "or",
  conditions: [
    { key: "$.age", operator: "gt", value: 40 },
    { key: "$.name", op: "equals", value: "John" },
  ],
};

try {
  parseAndEvaluate(user, invalidUntypedCondition);
} catch (e) {
  if (e instanceof ConditionParsingError) {
    console.error(e.message);
  }
} 