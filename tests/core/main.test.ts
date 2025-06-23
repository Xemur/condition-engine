import { describe, it, expect } from 'vitest';
import { evaluateCondition, parseAndEvaluate, ConditionParsingError, Condition } from '../../src';

describe('Condition Engine', () => {
  const user = {
    name: 'John Doe',
    age: 30,
    isVerified: true,
    roles: ['user', 'editor'],
    posts: [
      { title: 'Post 1', views: 100 },
      { title: 'Post 2', views: 200 },
    ],
  };

  type User = typeof user;

  describe('evaluateCondition - Atomic', () => {
    it("should handle 'eq'", () => {
      const c: Condition<User> = { key: '$.name', op: 'eq', value: 'John Doe' };
      expect(evaluateCondition(user, c)).toBe(true);
    });

    it("should handle 'neq'", () => {
      const c: Condition<User> = { key: '$.name', op: 'neq', value: 'Jane Doe' };
      expect(evaluateCondition(user, c)).toBe(true);
    });

    it("should handle 'gt'", () => {
      const c: Condition<User> = { key: '$.age', op: 'gt', value: 25 };
      expect(evaluateCondition(user, c)).toBe(true);
    });

    it("should handle 'gte'", () => {
      const c: Condition<User> = { key: '$.age', op: 'gte', value: 30 };
      expect(evaluateCondition(user, c)).toBe(true);
    });

    it("should handle 'lt'", () => {
      const c: Condition<User> = { key: '$.age', op: 'lt', value: 35 };
      expect(evaluateCondition(user, c)).toBe(true);
    });

    it("should handle 'lte'", () => {
      const c: Condition<User> = { key: '$.age', op: 'lte', value: 30 };
      expect(evaluateCondition(user, c)).toBe(true);
    });
  });

  describe('evaluateCondition - Array Operators', () => {
    it("should handle 'contains'", () => {
      const c: Condition<User> = {
        key: '$.roles',
        op: 'contains',
        value: 'editor',
      };
      expect(evaluateCondition(user, c)).toBe(true);
    });

    it("should handle 'in' (as alias for contains)", () => {
      const c: Condition<User> = { key: '$.roles', op: 'in', value: 'user' };
      expect(evaluateCondition(user, c)).toBe(true);
    });

    it("should handle 'nin'", () => {
      const c: Condition<User> = { key: '$.roles', op: 'nin', value: 'admin' };
      expect(evaluateCondition(user, c)).toBe(true);
    });

    it("should handle 'hasSize'", () => {
      const c: Condition<User> = { key: '$.roles', op: 'hasSize', value: 2 };
      expect(evaluateCondition(user, c)).toBe(true);
    });

    it("should handle 'containsAny'", () => {
      const c: Condition<User> = {
        key: '$.roles',
        op: 'containsAny',
        value: ['admin', 'editor'],
      };
      expect(evaluateCondition(user, c)).toBe(true);
    });

    it("should handle 'containsAll'", () => {
      const c: Condition<User> = {
        key: '$.roles',
        op: 'containsAll',
        value: ['user', 'editor'],
      };
      expect(evaluateCondition(user, c)).toBe(true);
      const c2: Condition<User> = {
        key: '$.roles',
        op: 'containsAll',
        value: ['user', 'admin'],
      };
      expect(evaluateCondition(user, c2)).toBe(false);
    });
  });

  describe('evaluateCondition - Logical', () => {
    it("should handle 'and'", () => {
      const c: Condition<User> = {
        logic: 'and',
        conditions: [
          { key: '$.age', op: 'gte', value: 30 },
          { key: '$.isVerified', op: 'eq', value: true },
        ],
      };
      expect(evaluateCondition(user, c)).toBe(true);
    });

    it("should handle 'or'", () => {
      const c: Condition<User> = {
        logic: 'or',
        conditions: [
          { key: '$.age', op: 'lt', value: 30 },
          { key: '$.isVerified', op: 'eq', value: true },
        ],
      };
      expect(evaluateCondition(user, c)).toBe(true);
    });

    it('should handle nested logical conditions', () => {
      const c: Condition<User> = {
        logic: 'and',
        conditions: [
          { key: '$.isVerified', op: 'eq', value: true },
          {
            logic: 'or',
            conditions: [
              { key: '$.age', op: 'eq', value: 25 },
              { key: '$.roles', op: 'contains', value: 'editor' },
            ],
          },
        ],
      };
      expect(evaluateCondition(user, c)).toBe(true);
    });
  });

  describe('parseAndEvaluate', () => {
    it('should correctly parse and evaluate a valid condition', () => {
      const untypedCondition = {
        logic: 'and',
        conditions: [
          { key: '$.age', op: 'gte', value: 30 },
          { key: '$.isVerified', op: 'eq', value: true },
        ],
      };
      expect(parseAndEvaluate(user, untypedCondition)).toBe(true);
    });

    it('should throw an error for an invalid condition object', () => {
      const invalidCondition = {
        logic: 'and',
        conditions: [{ key: '$.age', ope: 'gte', val: 30 }], // 'ope' and 'val' are invalid keys
      };
      expect(() => parseAndEvaluate(user, invalidCondition)).toThrow(ConditionParsingError);
    });

    it('should throw an error for an invalid operator', () => {
      const invalidCondition = {
        key: '$.age',
        op: 'invalidOp',
        value: 30,
      };
      expect(() => parseAndEvaluate(user, invalidCondition)).toThrow(ConditionParsingError);
    });
  });

  describe('Edge Cases', () => {
    it('should return false for an unknown operator by tricking the type system', () => {
      const conditionWithInvalidOp = {
        key: '$.name',
        op: 'unknownOp',
        value: 'John Doe',
      } as any;
      expect(evaluateCondition(user, conditionWithInvalidOp)).toBe(false);
    });
  });
});
