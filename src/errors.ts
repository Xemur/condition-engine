/**
 * Error thrown when parsing an untyped condition object fails.
 * This indicates that the provided condition data does not conform to the expected schema.
 */
export class ConditionParsingError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ConditionParsingError';
  }
}
