import { evaluateCondition, parseAndEvaluate } from "../src";

const userWithPosts = {
  id: 1,
  name: "John Doe",
  posts: [
    {
      id: 101,
      title: "First Post",
      tags: ["typescript", "generics"],
      content: "This is a post about TypeScript generics.",
    },
    {
      id: 102,
      title: "Second Post",
      tags: ["arrays", "conditions"],
      content: "This is another post, about arrays.",
    },
  ],
};

evaluateCondition(userWithPosts, {
  key: "$.posts[0].tags",
  op: "hasSize",
  value: 2,
}); // true

evaluateCondition(userWithPosts, {
  logic: "and",
  conditions: [
    {
      key: "$.posts[0].tags",
      op: "hasSize",
      value: 2,
    },
    {
      key: "$.posts[1].tags",
      op: "contains",
      value: "conditions",
    },
  ],
}); // true

// Parsing and evaluating an untyped condition (e.g. from a database)
parseAndEvaluate(userWithPosts, JSON.parse(`{
  "logic": "and",
  "conditions": [
    { "key": "$.posts[0].tags", "op": "hasSize", "value": 2 },
    { "key": "$.posts[1].tags", "op": "contains", "value": "conditions" },
  ]
}`)); // true
