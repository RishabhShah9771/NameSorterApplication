import assert from 'node:assert/strict';
import test from 'node:test';

import { NameParser } from '../src/name-parser.js';
import { NameSorter } from '../src/name-sorter.js';

const parser = new NameParser();
const sorter = new NameSorter();

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

  assert.deepEqual(
    sorter.sort(names).map(String),
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

  assert.deepEqual(
    sorter.sort(names).map(String),
    ['Amy smith', 'zoe Smith'],
  );
});

test('does not mutate the input array', () => {
  const names = parser.parseAll(
    'Janet Parsons\nMarin Alvarez',
  );

  const original = [...names];

  sorter.sort(names);

  assert.deepEqual(names, original);
});