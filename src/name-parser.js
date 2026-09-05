import { PersonName } from './person-name.js';

const MIN_PARTS = 2;
const MAX_PARTS = 4;

/**
 * Converts input lines into validated PersonName values.
 */
export class NameParser {
  parseAll(content) {
    if (typeof content !== 'string') {
      throw new TypeError('Name input must be text.');
    }

    return content
      .split(/\r?\n/u)
      .map((line, index) => ({
        value: line.trim(),
        lineNumber: index + 1,
      }))
      .filter(({ value }) => value.length > 0)
      .map(({ value, lineNumber }) => this.parse(value, lineNumber));
  }

  parse(line, lineNumber = 1) {
    const parts = line.trim().split(/\s+/u);

    if (parts.length < MIN_PARTS || parts.length > MAX_PARTS) {
      throw new Error(
        `Invalid name on line ${lineNumber}: expected 1 to 3 given names and 1 last name.`,
      );
    }

    return new PersonName(parts.slice(0, -1), parts.at(-1));
  }
}