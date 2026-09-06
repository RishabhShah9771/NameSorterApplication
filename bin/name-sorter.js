#!/usr/bin/env node

import { NameSorterApplication } from '../src/name-sorter-application.js';
import { FileSystemNameRepository } from '../src/file-system-name-repository.js';
import { NameParser } from '../src/name-parser.js';
import { NameSorter } from '../src/name-sorter.js';

/**
 * Creates and runs the name sorter from the command line.
 *
 * @returns {Promise<number>} The process exit code.
 */
async function main() {
  // The first user-provided command-line argument is the input file path.
  const inputPath = process.argv[2];

  // Stop early when the required input path is missing.
  if (!inputPath) {
    console.error(
      'Usage: name-sorter <path-to-unsorted-names-file>',
    );

    return 1;
  }

  /*
   * Inject concrete dependencies into the application.
   * This keeps the application logic independent and testable.
   */
  const application = new NameSorterApplication({
    repository: new FileSystemNameRepository(),
    parser: new NameParser(),
    sorter: new NameSorter(),
    output: console,
  });

  // Read, parse, sort, print, and save the supplied names.
  await application.run(inputPath);

  return 0;
}

try {
  process.exitCode = await main();
} catch (error) {
  // Safely display both standard Error objects and unexpected values.
  const message = error instanceof Error
    ? error.message
    : String(error);

  console.error(`Error: ${message}`);
  process.exitCode = 1;
}