import { PersonName } from './person-name.js';

const MIN_PARTS = 2;
const MAX_PARTS = 4;

export class NameParser {
  parseAll(content) {
    if (typeof content !== 'string') {
      throw new TypeError('Name input must be text.');
    }

    const names = [];

    // Support LF, CRLF, and CR line endings.
    const lines = content.split(/\r\n?|\n/u);

    for (const [index, line] of lines.entries()) {
      const trimmedLine = line.trim();

      // Empty and whitespace-only lines are intentionally ignored.
      if (trimmedLine) {
        names.push(this.parse(trimmedLine, index + 1));
      }
    }

    return names;
  }

  parse(line, lineNumber = 1) {
    if (typeof line !== 'string') {
      throw new TypeError(
        `Name on line ${lineNumber} must be text.`,
      );
    }

    const parts = line.trim().split(/\s+/u);

    if (parts.length < MIN_PARTS || parts.length > MAX_PARTS) {
      throw new Error(
        `Invalid name on line ${lineNumber}: expected 1 to 3 given names and 1 last name.`,
      );
    }

    const lastName = parts.pop();

    return new PersonName(parts, lastName);
  }
}