#!/usr/bin/env node

import { NameSorterApplication } from '../src/name-sorter-application.js';
import { FileSystemNameRepository } from '../src/file-system-name-repository.js';
import { NameParser } from '../src/name-parser.js';
import { NameSorter } from '../src/name-sorter.js';

const inputPath = process.argv[2];

if (!inputPath) {
  console.error('Usage: name-sorter <path-to-unsorted-names-file>');
  process.exitCode = 1;
} else {
  const application = new NameSorterApplication({
    repository: new FileSystemNameRepository(),
    parser: new NameParser(),
    sorter: new NameSorter(),
    output: console,
  });

  try {
    await application.run(inputPath);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exitCode = 1;
  }
}