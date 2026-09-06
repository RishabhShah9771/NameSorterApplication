import assert from 'node:assert/strict';
import {
  mkdtemp,
  readFile,
  rm,
  writeFile,
} from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import test from 'node:test';

import {
  FileSystemNameRepository,
  OUTPUT_FILE_NAME,
} from '../src/file-system-name-repository.js';
import { NameParser } from '../src/name-parser.js';
import { NameSorter } from '../src/name-sorter.js';
import { NameSorterApplication } from '../src/name-sorter-application.js';

test('prints sorted names and overwrites the required output file', async () => {
  const directory = await mkdtemp(
    path.join(tmpdir(), 'name-sorter-'),
  );

  try {
    const inputPath = path.join(directory, 'names.txt');
    const outputPath = path.join(
      directory,
      OUTPUT_FILE_NAME,
    );

    await writeFile(
      inputPath,
      'Janet Parsons\nMarin Alvarez\n',
      'utf8',
    );

    await writeFile(
      outputPath,
      'old content',
      'utf8',
    );

    const printed = [];

    const application = new NameSorterApplication({
      repository: new FileSystemNameRepository(),
      parser: new NameParser(),
      sorter: new NameSorter(),
      output: {
        log: (value) => printed.push(value),
      },
    });

    const actualOutputPath = await application.run(
      inputPath,
      directory,
    );

    assert.equal(actualOutputPath, outputPath);

    assert.deepEqual(
      printed,
      ['Marin Alvarez', 'Janet Parsons'],
    );

    assert.equal(
      await readFile(outputPath, 'utf8'),
      'Marin Alvarez\nJanet Parsons\n',
    );
  } finally {
    await rm(directory, {
      recursive: true,
      force: true,
    });
  }
});