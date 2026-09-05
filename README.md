# Name Sorter

A Node.js command-line application for sorting and managing names.

The program:

- Reads names from a text file.
- Sorts them first by last name and then by given names.
- Prints the sorted names to the screen.
- Creates or overwrites `sorted-names-list.txt`.
- Validates that each person has one to three given names and one last name.

## Requirements

- Node.js 20 or newer
- npm

The project has no third-party dependencies.

## Installation

```bash
npm install
npm link
```

## Run

```bash
name-sorter ./unsorted-names-list.txt
```

Alternatively:

```bash
npm start -- ./unsorted-names-list.txt
```

The sorted names will be printed to the terminal and written to:

```text
sorted-names-list.txt
```

The output file is created in the directory where the command is executed.

## Run tests

```bash
npm test
```

## Input rules

- One name per line.
- A name must have one to three given names.
- The final word is treated as the last name.
- Blank lines are ignored.
- Extra whitespace is normalized.
- Invalid names stop processing and report the line number.

## Design

Responsibilities are separated into focused modules:

- `PersonName` represents an immutable name.
- `NameParser` handles input validation.
- `NameSorter` contains the sorting logic.
- `FileSystemNameRepository` handles file operations.
- `NameSorterApplication` coordinates the use case.
- `bin/name-sorter.js` provides the command-line interface.

This design keeps sorting logic independent from the file system and console, making it easier to understand, test, and extend.

The optional build pipeline is intentionally not included.