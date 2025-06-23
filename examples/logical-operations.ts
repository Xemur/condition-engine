import { evaluateCondition, Condition } from '../src';

const user = {
  name: 'Jane Doe',
  age: 28,
  isVerified: true,
  plan: 'premium',
  roles: ['user', 'writer'],
};

type User = typeof user;

const andCondition: Condition<User> = {
  logic: 'and',
  conditions: [
    { key: '$.age', op: 'gt', value: 25 },
    { key: '$.plan', op: 'eq', value: 'premium' },
  ],
};
console.log(evaluateCondition(user, andCondition)); // true

const orCondition: Condition<User> = {
  logic: 'or',
  conditions: [
    { key: '$.name', op: 'eq', value: 'John Doe' },
    { key: '$.isVerified', op: 'eq', value: true },
  ],
};
console.log(evaluateCondition(user, orCondition)); // true

const nestedCondition: Condition<User> = {
  logic: 'and',
  conditions: [
    { key: '$.isVerified', op: 'eq', value: true },
    {
      logic: 'or',
      conditions: [
        { key: '$.age', op: 'lt', value: 20 },
        { key: '$.roles', op: 'contains', value: 'writer' },
      ],
    },
  ],
};
console.log(evaluateCondition(user, nestedCondition)); // true
