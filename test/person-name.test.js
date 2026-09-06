import assert from 'node:assert/strict';
import test from 'node:test';

import { PersonName } from '../src/person-name.js';

/**
 * Verifies that PersonName stores an independent, immutable copy
 * of its input data.
 */
test('creates an immutable valid person name', () => {
  const givenNames = ['Hunter', 'Uriah', 'Mathew'];
  const personName = new PersonName(givenNames, 'Clarke');

  // Changing the original array must not affect the stored name.
  givenNames[0] = 'Changed';

  assert.equal(
    personName.toString(),
    'Hunter Uriah Mathew Clarke',
  );

  assert.equal(Object.isFrozen(personName), true);
  assert.equal(Object.isFrozen(personName.givenNames), true);

  // Frozen public properties cannot be reassigned.
  assert.throws(
    () => {
      personName.lastName = 'Changed';
    },
    TypeError,
  );
});

/**
 * Verifies that given names must be supplied as an array.
 */
test('rejects given names that are not provided as an array', () => {
  assert.throws(
    () => new PersonName('Hunter', 'Clarke'),
    {
      name: 'TypeError',
      message: 'Given names must be an array.',
    },
  );
});

/**
 * Verifies the required limit of one to three given names.
 */
test('requires between one and three given names', () => {
  assert.throws(
    () => new PersonName([], 'Clarke'),
    {
      name: 'RangeError',
      message: 'A person must have between 1 and 3 given names.',
    },
  );

  assert.throws(
    () =>
      new PersonName(
        ['One', 'Two', 'Three', 'Four'],
        'Last',
      ),
    {
      name: 'RangeError',
      message: 'A person must have between 1 and 3 given names.',
    },
  );
});

/**
 * Verifies that every part of a name contains meaningful text.
 */
test('rejects empty given names and last names', () => {
  assert.throws(
    () => new PersonName(['Hunter', ''], 'Clarke'),
    {
      name: 'TypeError',
      message: 'Every given name must be a non-empty string.',
    },
  );

  assert.throws(
    () => new PersonName(['Hunter'], '   '),
    {
      name: 'TypeError',
      message: 'Last name must be a non-empty string.',
    },
  );
});