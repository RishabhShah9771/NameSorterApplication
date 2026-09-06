const MIN_GIVEN_NAMES = 1;
const MAX_GIVEN_NAMES = 3;

/**
 * Immutable representation of a person's name.
 */
export class PersonName {
  #givenNames;

  constructor(givenNames, lastName) {
    if (!Array.isArray(givenNames)) {
      throw new TypeError('Given names must be an array.');
    }

    if (
      givenNames.length < MIN_GIVEN_NAMES ||
      givenNames.length > MAX_GIVEN_NAMES
    ) {
      throw new RangeError(
        'A person must have between 1 and 3 given names.',
      );
    }

    const hasInvalidGivenName = givenNames.some(
      (name) =>
        typeof name !== 'string' ||
        name.trim().length === 0,
    );

    if (hasInvalidGivenName) {
      throw new TypeError(
        'Every given name must be a non-empty string.',
      );
    }

    if (
      typeof lastName !== 'string' ||
      lastName.trim().length === 0
    ) {
      throw new TypeError(
        'Last name must be a non-empty string.',
      );
    }

    // Store normalized, independent values.
    this.#givenNames = Object.freeze(
      givenNames.map((name) => name.trim()),
    );

    this.lastName = lastName.trim();

    // Prevent modification of public instance properties.
    Object.freeze(this);
  }

  get givenNames() {
    return this.#givenNames;
  }

  toString() {
    return `${this.#givenNames.join(' ')} ${this.lastName}`;
  }
}