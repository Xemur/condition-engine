import { evaluateCondition, Condition } from "../src";

const project = {
  id: "proj_1",
  name: "Condition Engine",
  tags: ["typescript", "library", "rules"],
  contributors: [
    { name: "Alice", commits: 15 },
    { name: "Bob", commits: 25 },
  ],
};

type Project = typeof project;

const containsCondition: Condition<Project> = {
  key: "$.tags",
  op: "contains",
  value: "typescript",
};
console.log(evaluateCondition(project, containsCondition)); // true

const hasSizeCondition: Condition<Project> = {
  key: "$.contributors",
  op: "hasSize",
  value: 2,
};
console.log(evaluateCondition(project, hasSizeCondition)); // true

const containsAnyCondition: Condition<Project> = {
  key: "$.tags",
  op: "containsAny",
  value: ["javascript", "rules"],
};
console.log(evaluateCondition(project, containsAnyCondition)); // true

const containsAllCondition: Condition<Project> = {
  key: "$.tags",
  op: "containsAll",
  value: ["library", "typescript"],
};
console.log(evaluateCondition(project, containsAllCondition)); // true 