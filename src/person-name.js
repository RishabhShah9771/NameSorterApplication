/**
 * Immutable representation of a person's name.
 */
export class PersonName {
  #givenNames;

  constructor(givenNames, lastName) {
    this.#givenNames = Object.freeze([...givenNames]);
    this.lastName = lastName;

    Object.freeze(this);
  }

  get givenNames() {
    return [...this.#givenNames];
  }

  toString() {
    return [...this.#givenNames, this.lastName].join(' ');
  }
}