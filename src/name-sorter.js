/**
 * Sorts names without changing the caller's array.
 */
export class NameSorter {
  #collator;

  constructor(collator = new Intl.Collator('en', { sensitivity: 'base' })) {
    this.#collator = collator;
  }

  sort(names) {
    return [...names].sort((left, right) => this.compare(left, right));
  }

  compare(left, right) {
    const lastNameResult = this.#compareText(
      left.lastName,
      right.lastName,
    );

    if (lastNameResult !== 0) {
      return lastNameResult;
    }

    const leftGivenNames = left.givenNames;
    const rightGivenNames = right.givenNames;
    const length = Math.max(
      leftGivenNames.length,
      rightGivenNames.length,
    );

    for (let index = 0; index < length; index += 1) {
      if (leftGivenNames[index] === undefined) {
        return -1;
      }

      if (rightGivenNames[index] === undefined) {
        return 1;
      }

      const result = this.#compareText(
        leftGivenNames[index],
        rightGivenNames[index],
      );

      if (result !== 0) {
        return result;
      }
    }

    return 0;
  }

  #compareText(left, right) {
    const caseInsensitiveResult = this.#collator.compare(left, right);

    return (
      caseInsensitiveResult ||
      left.localeCompare(right, 'en')
    );
  }
}