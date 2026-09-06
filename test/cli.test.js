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

const execFileAsync = promisify(execFile);
const cliPath = path.resolve('bin/name-sorter.js');

test('runs through the CLI and handles CRLF input', async () => {
  const directory = await mkdtemp(
    path.join(tmpdir(), 'name-sorter-cli-'),
  );

  try {
    const inputPath = path.join(
      directory,
      'unsorted.txt',
    );

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

    assert.equal(stderr, '');

    assert.equal(
      stdout,
      'Marin Alvarez\nJanet Parsons\n',
    );

    assert.equal(
      await readFile(
        path.join(directory, 'sorted-names-list.txt'),
        'utf8',
      ),
      'Marin Alvarez\nJanet Parsons\n',
    );
  } finally {
    await rm(directory, {
      recursive: true,
      force: true,
    });
  }
});

test('shows usage and exits unsuccessfully when input path is missing', async () => {
  await assert.rejects(
    execFileAsync(process.execPath, [cliPath]),
    ({ code, stderr }) =>
      code === 1 &&
      stderr.includes('Usage: name-sorter'),
  );
});