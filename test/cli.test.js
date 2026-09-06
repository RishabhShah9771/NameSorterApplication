import assert from 'node:assert/strict';
import { execFile } from 'node:child_process';
import {
  mkdtemp,
  readFile,
  rm,
  writeFile,
} from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { promisify } from 'node:util';
import test from 'node:test';

// Convert execFile into a promise-based function for async tests.
const execFileAsync = promisify(execFile);

// Resolve the CLI location independently of the temporary test directory.
const cliPath = path.resolve('bin/name-sorter.js');

/**
 * Verifies that the command-line application accepts Windows-style
 * line endings and writes the correctly sorted output.
 */
test('runs through the CLI and handles CRLF input', async () => {
  // Run the CLI inside a temporary directory to isolate generated files.
  const directory = await mkdtemp(
    path.join(tmpdir(), 'name-sorter-cli-'),
  );

  try {
    const inputPath = path.join(directory, 'unsorted.txt');
    const outputPath = path.join(
      directory,
      'sorted-names-list.txt',
    );

    // CRLF represents line endings commonly found in Windows files.
    await writeFile(
      inputPath,
      'Janet Parsons\r\nMarin Alvarez\r\n',
      'utf8',
    );

    const { stdout, stderr } = await execFileAsync(
      process.execPath,
      [cliPath, inputPath],
      { cwd: directory },
    );

    // A successful execution should not produce error output.
    assert.equal(stderr, '');

    // Confirm that sorted names are printed to standard output.
    assert.equal(
      stdout,
      'Marin Alvarez\nJanet Parsons\n',
    );

    // Confirm that the same sorted names are written to the output file.
    assert.equal(
      await readFile(outputPath, 'utf8'),
      'Marin Alvarez\nJanet Parsons\n',
    );
  } finally {
    // Remove all temporary test files after execution.
    await rm(directory, {
      recursive: true,
      force: true,
    });
  }
});

/**
 * Verifies that the CLI rejects execution when the required
 * input-file argument is missing.
 */
test('shows usage and exits unsuccessfully when input path is missing', async () => {
  await assert.rejects(
    execFileAsync(process.execPath, [cliPath]),
    ({ code, stderr }) =>
      code === 1 &&
      stderr.includes('Usage: name-sorter'),
  );
});