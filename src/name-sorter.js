/**
 * Sorts names by last name and then by given names
 * without modifying the caller's array.
 */
export class NameSorter {
  #collator;

  constructor(collator = new Intl.Collator('en', { sensitivity: 'base' })) {
    // Reuse one collator because creating it for every comparison is expensive.
    this.#collator = collator;
  }

  /**
   * Returns a new sorted array, preserving the original array.
   */
  sort(names) {
    return [...names].sort((left, right) => this.compare(left, right));
  }

  /**
   * Compares last names first, followed by each given name.
   */
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
    const commonLength = Math.min(
      leftGivenNames.length,
      rightGivenNames.length,
    );

    // Compare corresponding given names from left to right.
    for (let index = 0; index < commonLength; index += 1) {
      const result = this.#compareText(
        leftGivenNames[index],
        rightGivenNames[index],
      );

      if (result !== 0) {
        return result;
      }
    }

    // If all shared names match, place the shorter name first.
    return leftGivenNames.length - rightGivenNames.length;
  }

  /**
   * Compares text case-insensitively, then uses case as a tie-breaker
   * to produce consistent ordering.
   */
  #compareText(left, right) {
    const caseInsensitiveResult = this.#collator.compare(left, right);

    return caseInsensitiveResult || left.localeCompare(right, 'en');
  }
}