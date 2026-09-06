import assert from 'node:assert/strict';
import test from 'node:test';

import { NameParser } from '../src/name-parser.js';
import { NameSorter } from '../src/name-sorter.js';

const parser = new NameParser();
const sorter = new NameSorter();

test('sorts the complete official assessment example', () => {
  /*
   * The PDF contains a spelling inconsistency: "Vaugh Lewis"
   * appears in its input while "Vaughn Lewis" appears in its output.
   * This test consistently uses "Vaughn Lewis" because sorting must
   * preserve the original spelling.
   */
  const names = parser.parseAll(
    [
      'Janet Parsons',
      'Vaughn Lewis',
      'Adonis Julius Archer',
      'Shelby Nathan Yoder',
      'Marin Alvarez',
      'London Lindsey',
      'Beau Tristan Bentley',
      'Leo Gardner',
      'Hunter Uriah Mathew Clarke',
      'Mikayla Lopez',
      'Frankie Conner Ritter',
    ].join('\n'),
  );

  const sortedNames = sorter.sort(names).map(String);

  assert.deepEqual(
    sortedNames,
    [
      'Marin Alvarez',
      'Adonis Julius Archer',
      'Beau Tristan Bentley',
      'Hunter Uriah Mathew Clarke',
      'Leo Gardner',
      'Vaughn Lewis',
      'London Lindsey',
      'Mikayla Lopez',
      'Janet Parsons',
      'Frankie Conner Ritter',
      'Shelby Nathan Yoder',
    ],
  );
});

test('sorts by last name and then by every given name', () => {
  const names = parser.parseAll(
    [
      'Zoe Marie Smith',
      'Amy Zoe Smith',
      'Amy Jane Smith',
      'Amy Smith',
      'John Adams',
    ].join('\n'),
  );

  const sortedNames = sorter.sort(names).map(String);

  assert.deepEqual(
    sortedNames,
    [
      'John Adams',
      'Amy Smith',
      'Amy Jane Smith',
      'Amy Zoe Smith',
      'Zoe Marie Smith',
    ],
  );
});

test('sorts case-insensitively with a deterministic tie-breaker', () => {
  const names = parser.parseAll(
    'zoe Smith\nAmy smith\n',
  );

  const sortedNames = sorter.sort(names).map(String);

  assert.deepEqual(
    sortedNames,
    ['Amy smith', 'zoe Smith'],
  );
});

test('does not mutate the input array', () => {
  const names = parser.parseAll(
    'Janet Parsons\nMarin Alvarez',
  );

  const originalOrder = [...names];

  sorter.sort(names);

  assert.deepEqual(names, originalOrder);
});

test('sorts 10,000 entries with independently verified positions', () => {
  const entryCount = 10_000;
  const numberWidth = String(entryCount).length;

  const content = Array.from(
    { length: entryCount },
    (_, index) => {
      const givenNameNumber = String(entryCount - index)
        .padStart(numberWidth, '0');

      const lastNameNumber = String(index % 100)
        .padStart(3, '0');

      return `Given${givenNameNumber} Last${lastNameNumber}`;
    },
  ).join('\n');

  const names = parser.parseAll(content);
  const originalOrder = [...names];
  const sortedNames = sorter.sort(names).map(String);

  assert.equal(sortedNames.length, entryCount);
  assert.deepEqual(names, originalOrder);

  // First last-name group.
  assert.equal(sortedNames[0], 'Given00100 Last000');
  assert.equal(sortedNames[1], 'Given00200 Last000');
  assert.equal(sortedNames[98], 'Given09900 Last000');
  assert.equal(sortedNames[99], 'Given10000 Last000');

  // Beginning and end of the next last-name group.
  assert.equal(sortedNames[100], 'Given00099 Last001');
  assert.equal(sortedNames[199], 'Given09999 Last001');

  // Positions from the middle of the result.
  assert.equal(sortedNames[5000], 'Given00050 Last050');
  assert.equal(sortedNames[5099], 'Given09950 Last050');

  // Final last-name group.
  assert.equal(sortedNames[9900], 'Given00001 Last099');
  assert.equal(sortedNames[9999], 'Given09901 Last099');
});