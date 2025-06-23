# Condition Engine

A TypeScript library for evaluating conditions against JavaScript objects with full type safety and runtime validation.

## Overview

This library provides a simple way to define and evaluate conditions against data objects. It supports two main approaches:

**Compile-time type safety**: Define conditions directly in TypeScript with full autocompletion and type checking. Perfect for any scenario where conditions are known at development time.

**Runtime validation**: Parse and validate conditions from external sources like databases, APIs, or user input. While these conditions can't be type-checked at compile time, they're validated at runtime (through zod).

### Example use cases

- **User-defined Rules**: Allow users to create custom filtering, sorting, or validation rules through forms that generate condition objects
- **Database-stored Logic**: Store business rules, access controls, or feature flags as condition objects in your database
- **Configuration-driven Behavior**: Define application behavior through config files or admin panels

The library handles both scenarios, whether you're writing conditions in TypeScript or processing them from external sources, you get a consistent, powerful API for evaluating conditions against objects.

## Installation

```bash
npm install condition-engine
```

## Quick Start

```typescript
import { evaluateCondition } from 'condition-engine';

interface User {
  name: string;
  age: number;
  tags: string[];
  profile: {
    isActive: boolean;
    lastLogin: string;
  };
}

const user: User = {
  name: 'John Doe',
  age: 30,
  tags: ['developer', 'typescript'],
  profile: {
    isActive: true,
    lastLogin: '2024-01-15',
  },
};

// A simple atomic condition
// ✅ TypeScript provides autocompletion for keys and enforces correct value types
const isAdult = evaluateCondition(user, {
  key: '$.age', // Autocompleted: '$.name' | '$.age' | '$.tags' | '$.profile.isActive' | etc.
  operator: 'gte',
  value: 18, // Must be number (inferred from '$.age' type)
});

const hasTypescriptTag = evaluateCondition(user, {
  key: '$.tags', // Autocompleted from User interface
  operator: 'contains',
  value: 'typescript', // Must be string (inferred from '$.tags' element type)
});

// ❌ TypeScript prevents type mismatches at compile time
// const invalid = evaluateCondition(user, {
//   key: '$.age',
//   operator: 'gte',
//   value: '18'        // Error: string not assignable to number
// });

console.log(isAdult); // true
console.log(hasTypescriptTag); // true
```

## Features

- **Type Safety**: Full TypeScript support with autocompletion for object paths
- **Runtime Validation**: Parse and validate conditions from external sources
- **Flexible Path Access**: Support for nested objects and arrays using dot notation
- **100% Test Coverage**: Ensuring reliability

## 📦 Bundle Size

- **Ultra-lightweight**: 144 bytes with all dependencies minified and brotlied
- Measured with [`size-limit`](https://github.com/ai/size-limit)

## Usage

### Basic Conditions

```typescript
import { evaluateCondition } from 'condition-engine';

const product = {
  name: 'Laptop',
  price: 999,
  category: 'electronics',
  tags: ['portable', 'work', 'gaming'],
  specs: {
    ram: 16,
    storage: 512,
  },
};

// Numeric comparison
const isExpensive = evaluateCondition(product, {
  key: '$.price',
  operator: 'gt',
  value: 500,
});

// Nested object access
const hasEnoughRAM = evaluateCondition(product, {
  key: '$.specs.ram',
  operator: 'gte',
  value: 8,
});
```

### Logical Conditions

Combine multiple conditions using `and` and `or` logic, including nested conditions:

```typescript
// Complex condition with AND logic
const premiumLaptop = evaluateCondition(product, {
  operator: 'and',
  conditions: [
    { key: '$.category', operator: 'eq', value: 'electronics' },
    { key: '$.price', operator: 'gt', value: 800 },
    { key: '$.specs.ram', operator: 'gte', value: 16 },
  ],
});

// OR logic
const budgetOrGaming = evaluateCondition(product, {
  operator: 'or',
  conditions: [
    { key: '$.price', operator: 'lt', value: 500 },
    { key: '$.tags', operator: 'contains', value: 'gaming' },
  ],
});

// Nested conditions: Mix AND/OR logic for complex business rules
const targetCustomer = evaluateCondition(product, {
  operator: 'and',
  conditions: [
    { key: '$.category', operator: 'eq', value: 'electronics' },
    {
      operator: 'or', // Nested OR within AND
      conditions: [
        // Either budget-friendly...
        {
          operator: 'and',
          conditions: [
            { key: '$.price', operator: 'lt', value: 600 },
            { key: '$.tags', operator: 'contains', value: 'portable' },
          ],
        },
        // ...or high-performance
        {
          operator: 'and',
          conditions: [
            { key: '$.specs.ram', operator: 'gte', value: 16 },
            { key: '$.specs.storage', operator: 'gte', value: 512 },
          ],
        },
      ],
    },
  ],
});

// Deep nesting: Complex user eligibility check
const eligibleUser = evaluateCondition(user, {
  operator: 'and',
  conditions: [
    { key: '$.profile.isActive', operator: 'eq', value: true },
    {
      operator: 'or',
      conditions: [
        // Premium user path
        {
          operator: 'and',
          conditions: [
            { key: '$.age', operator: 'gte', value: 25 },
            { key: '$.tags', operator: 'containsAny', value: ['premium', 'enterprise'] },
          ],
        },
        // Developer path
        {
          operator: 'and',
          conditions: [
            { key: '$.tags', operator: 'contains', value: 'developer' },
            {
              operator: 'or', // Nested OR within AND within OR
              conditions: [
                { key: '$.tags', operator: 'contains', value: 'typescript' },
                { key: '$.tags', operator: 'contains', value: 'javascript' },
              ],
            },
          ],
        },
      ],
    },
  ],
});
```

### Array-Specific Operators

Special operators available only for array properties:

```typescript
const user = {
  skills: ['javascript', 'typescript', 'react'],
  projects: [
    { name: 'Project A', status: 'completed' },
    { name: 'Project B', status: 'in-progress' },
  ],
};

// Check array size
const hasMultipleSkills = evaluateCondition(user, {
  key: '$.skills',
  operator: 'hasSize',
  value: 3,
});

// Check if array contains any of the values
const hasWebSkills = evaluateCondition(user, {
  key: '$.skills',
  operator: 'containsAny',
  value: ['react', 'vue', 'angular'],
});

// Check if array contains all values
const hasFullStackSkills = evaluateCondition(user, {
  key: '$.skills',
  operator: 'containsAll',
  value: ['javascript', 'typescript'],
});
```

### Working with Untyped Conditions

Parse and validate conditions from external sources using `parseAndEvaluate`:

```typescript
import { parseAndEvaluate, ConditionParsingError } from 'condition-engine';

// Condition from API, config file, or user input
const conditionData = {
  logic: 'and',
  conditions: [
    { key: '$.age', op: 'gte', value: 18 },
    { key: '$.status', op: 'eq', value: 'active' },
  ],
};

const user = { age: 25, status: 'active', name: 'Alice' };

try {
  // Parse and evaluate in one step
  const result = parseAndEvaluate(user, conditionData);
  console.log(result); // true
} catch (error) {
  if (error instanceof ConditionParsingError) {
    console.error('Invalid condition format:', error.message);
  }
}

// Single atomic condition
const atomicCondition = { key: '$.age', op: 'gte', value: 21 };
const isAdult = parseAndEvaluate(user, atomicCondition); // true

// Complex nested condition from external source
const complexCondition = {
  logic: 'or',
  conditions: [
    {
      logic: 'and',
      conditions: [
        { key: '$.age', op: 'lt', value: 18 },
        { key: '$.status', op: 'eq', value: 'minor' },
      ],
    },
    {
      logic: 'and',
      conditions: [
        { key: '$.age', op: 'gte', value: 18 },
        { key: '$.status', op: 'eq', value: 'active' },
      ],
    },
  ],
};

try {
  const result = parseAndEvaluate(user, complexCondition);
  console.log(result); // true (matches second condition group)
} catch (error) {
  console.error('Validation failed:', error.message);
}
```

## Available Operators

### Comparison Operators

- `eq`: Equal to
- `neq`: Not equal to
- `lt`: Less than
- `lte`: Less than or equal to
- `gt`: Greater than
- `gte`: Greater than or equal to

### Array Operators

- `in`: Value is in array
- `nin`: Value is not in array
- `contains`: Array contains value (alias for `in`)
- `hasSize`: Array has specific length
- `containsAny`: Array contains any of the provided values
- `containsAll`: Array contains all provided values

### Logical Operators

- `and`: All conditions must be true
- `or`: At least one condition must be true

## Path Syntax

Use dot notation with `$` prefix to access object properties:

```typescript
const data = {
  user: {
    profile: {
      settings: {
        theme: 'dark',
      },
    },
  },
  posts: [
    { title: 'First Post', published: true },
    { title: 'Draft', published: false },
  ],
};

// Access nested properties
('$.user.profile.settings.theme'); // 'dark'

// Access array elements
('$.posts[0].title'); // 'First Post'
('$.posts[1].published'); // false
```

## Type Safety

The library provides full TypeScript support with intelligent autocompletion and compile-time type checking:

```typescript
interface User {
  id: number;
  name: string;
  preferences: {
    theme: 'light' | 'dark';
    notifications: boolean;
  };
  tags: string[];
}

const user: User = {
  id: 1,
  name: 'John',
  email: 'john@example.com',
  preferences: { theme: 'dark', notifications: true },
  tags: ['admin', 'developer'],
};

// ✅ Valid: Correct types and paths with nested conditions
const validConditions = evaluateCondition(user, {
  operator: 'and',
  conditions: [
    { key: '$.id', operator: 'gt', value: 0 }, // number > number
    { key: '$.preferences.theme', operator: 'eq', value: 'dark' }, // 'light'|'dark' === 'dark'
    { key: '$.tags', operator: 'contains', value: 'admin' }, // string[] contains string
  ],
});

// ❌ TypeScript Errors: Invalid paths and incompatible types
const invalidConditions = evaluateCondition(user, {
  operator: 'or',
  conditions: [
    { key: '$.invalidProp', operator: 'eq', value: 'test' }, // Error: Property doesn't exist
    { key: '$.preferences.theme', operator: 'eq', value: 'blue' }, // Error: 'blue' not assignable to 'light'|'dark'
    { key: '$.name', operator: 'gt', value: 100 }, // Error: string field compared to number
    { key: '$.tags', operator: 'contains', value: 123 }, // Error: number not assignable to string
  ],
});
```

## Error Handling

The library provides clear error messages for invalid conditions:

```typescript
import { evaluateCondition, ConditionParsingError } from 'condition-engine';

const user = { age: 25, name: 'John' };

try {
  const result = evaluateCondition(user, {
    key: '$.age',
    operator: 'invalid_operator', // Invalid operator
    value: 18,
  });
} catch (error) {
  if (error instanceof ConditionParsingError) {
    console.log('Condition evaluation failed:', error.message);
  }
}
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Run tests (`npm test`)
4. Commit your changes (`git commit -m 'Add some amazing feature'`)
5. Push to the branch (`git push origin feature/amazing-feature`)
6. Open a Pull Request

## License

MIT License - see the [LICENSE](LICENSE) file for details.
