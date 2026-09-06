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
import { NameSorterApplication } from '../src/name-sorter-application.js';
import { NameSorter } from '../src/name-sorter.js';

/**
 * Verifies the complete application workflow, including reading,
 * parsing, sorting, console output, and overwriting the output file.
 */
test('prints sorted names and overwrites the required output file', async () => {
  // Use an isolated directory to avoid modifying project files.
  const directory = await mkdtemp(
    path.join(tmpdir(), 'name-sorter-'),
  );

  try {
    const inputPath = path.join(directory, 'names.txt');
    const outputPath = path.join(
      directory,
      OUTPUT_FILE_NAME,
    );

    // Create an input file containing names in unsorted order.
    await writeFile(
      inputPath,
      'Janet Parsons\nMarin Alvarez\n',
      'utf8',
    );

    // Create an existing output file to verify overwrite behavior.
    await writeFile(outputPath, 'old content', 'utf8');

    // Capture console output without printing during the test.
    const printedNames = [];

    const application = new NameSorterApplication({
      repository: new FileSystemNameRepository(),
      parser: new NameParser(),
      sorter: new NameSorter(),
      output: {
        log: (name) => printedNames.push(name),
      },
    });

    const actualOutputPath = await application.run(
      inputPath,
      directory,
    );

    // Confirm that the application returns the required output path.
    assert.equal(actualOutputPath, outputPath);

    // Confirm that names are printed in the correct sorted order.
    assert.deepEqual(
      printedNames,
      ['Marin Alvarez', 'Janet Parsons'],
    );

    // Confirm that the existing output file was overwritten.
    assert.equal(
      await readFile(outputPath, 'utf8'),
      'Marin Alvarez\nJanet Parsons\n',
    );
  } finally {
    // Always remove temporary files, even when the test fails.
    await rm(directory, {
      recursive: true,
      force: true,
    });
  }
});

/**
 * Verifies that the application can process significantly more than
 * the 1,000 names required by the assessment.
 */
test('processes 10,000 entries through the application', async () => {
  const entryCount = 10_000;
  const numberWidth = String(entryCount).length;

  /*
   * Generate valid names with predictable values.
   * Last names repeat across 100 groups to exercise both primary
   * last-name sorting and secondary given-name sorting.
   */
  const content = Array.from(
    { length: entryCount },
    (_, index) => {
      const number = String(entryCount - index)
        .padStart(numberWidth, '0');

      const lastName = String(index % 100)
        .padStart(3, '0');

      return `Given${number} Last${lastName}`;
    },
  ).join('\n');

  const printedNames = [];
  let writtenNames = [];

  /*
   * Use an in-memory repository because this test focuses on
   * application coordination rather than filesystem behavior.
   */
  const repository = {
    read: async () => content,

    write: async (names) => {
      writtenNames = names;
      return '/virtual/sorted-names-list.txt';
    },
  };

  const application = new NameSorterApplication({
    repository,
    parser: new NameParser(),
    sorter: new NameSorter(),
    output: {
      log: (name) => printedNames.push(name),
    },
  });

  const outputPath = await application.run(
    '/virtual/input.txt',
  );

  // Confirm that no names were lost while processing.
  assert.equal(printedNames.length, entryCount);
  assert.equal(writtenNames.length, entryCount);

  // Console and file output must receive identical results.
  assert.deepEqual(printedNames, writtenNames);

  // Confirm that the repository's output path is returned.
  assert.equal(
    outputPath,
    '/virtual/sorted-names-list.txt',
  );
});

/**
 * Documents and verifies the application's behavior when the
 * input file is empty or contains only whitespace.
 */
test('creates an empty output file for empty input', async () => {
  // Use a separate temporary directory for the empty-input scenario.
  const directory = await mkdtemp(
    path.join(tmpdir(), 'name-sorter-empty-'),
  );

  try {
    const inputPath = path.join(directory, 'empty.txt');
    const outputPath = path.join(
      directory,
      OUTPUT_FILE_NAME,
    );

    // Create an input file containing only whitespace and blank lines.
    await writeFile(inputPath, '  \n\n  ', 'utf8');

    const printedNames = [];

    const application = new NameSorterApplication({
      repository: new FileSystemNameRepository(),
      parser: new NameParser(),
      sorter: new NameSorter(),
      output: {
        log: (name) => printedNames.push(name),
      },
    });

    const actualOutputPath = await application.run(
      inputPath,
      directory,
    );

    // The required output file should still be created.
    assert.equal(actualOutputPath, outputPath);

    // No names should be printed for an empty input file.
    assert.deepEqual(printedNames, []);

    // The generated output file should contain no data.
    assert.equal(
      await readFile(outputPath, 'utf8'),
      '',
    );
  } finally {
    // Clean up the temporary directory after the test.
    await rm(directory, {
      recursive: true,
      force: true,
    });
  }
});