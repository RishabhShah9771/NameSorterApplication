import assert from 'node:assert/strict';
import test from 'node:test';

import { NameParser } from '../src/name-parser.js';

const parser = new NameParser();

test('parses one to three given names and a last name', () => {
  assert.equal(
    parser.parse('Marin Alvarez').toString(),
    'Marin Alvarez',
  );

  assert.equal(
    parser.parse('Beau Tristan Bentley').toString(),
    'Beau Tristan Bentley',
  );

  assert.equal(
    parser.parse('Hunter Uriah Mathew Clarke').toString(),
    'Hunter Uriah Mathew Clarke',
  );
});

test('normalizes surrounding and repeated whitespace', () => {
  const name = parser.parse(
    '  Hunter   Uriah Mathew   Clarke  ',
  );

  assert.equal(
    name.toString(),
    'Hunter Uriah Mathew Clarke',
  );
});

test('ignores blank lines while preserving useful line numbers', () => {
  const names = parser.parseAll(
    'Janet Parsons\n\n  \nMarin Alvarez\n',
  );

  assert.deepEqual(
    names.map(String),
    ['Janet Parsons', 'Marin Alvarez'],
  );
});

test('supports LF, CRLF, and CR line endings', () => {
  const inputs = [
    'Janet Parsons\nMarin Alvarez',
    'Janet Parsons\r\nMarin Alvarez',
    'Janet Parsons\rMarin Alvarez',
  ];

  for (const input of inputs) {
    assert.deepEqual(
      parser.parseAll(input).map(String),
      ['Janet Parsons', 'Marin Alvarez'],
    );
  }
});

test('returns an empty collection for empty input', () => {
  assert.deepEqual(parser.parseAll(''), []);
  assert.deepEqual(parser.parseAll('  \n\n  '), []);
});

test('rejects a name without a given name', () => {
  assert.throws(
    () => parser.parseAll('Janet Parsons\nMadonna'),
    /line 2.*1 to 3 given names/u,
  );
});

test('rejects more than three given names', () => {
  assert.throws(
    () => parser.parse('One Two Three Four Last'),
    /expected 1 to 3 given names and 1 last name/u,
  );
});

test('rejects non-string input', () => {
  assert.throws(
    () => parser.parseAll(null),
    {
      name: 'TypeError',
      message: 'Name input must be text.',
    },
  );
});