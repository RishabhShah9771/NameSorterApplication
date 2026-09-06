# Name Sorter

A Node.js command-line application that sorts names by last name and then by given names.

The application:

- Reads names from a text file.
- Sorts names first by last name and then by given names.
- Prints the sorted names to the terminal.
- Creates or overwrites `sorted-names-list.txt`.
- Validates that every person has one to three given names and one last name.

## Requirements

- Node.js 20 or newer
- npm

The project has no third-party dependencies.

## Installation

Navigate to the project directory and install the project:

```bash
npm install
```

Optionally, register the `name-sorter` command locally:

```bash
npm link
```

## Running the application

After running `npm link`, execute:

```bash
name-sorter ./unsorted-names-list.txt
```

Alternatively, run the application without linking it:

```bash
npm start -- ./unsorted-names-list.txt
```

The application prints the sorted names to the terminal and creates or overwrites the following file in the current working directory:

```text
sorted-names-list.txt
```

## Example

Given an `unsorted-names-list.txt` file containing:

```text
Janet Parsons
Vaughn Lewis
Adonis Julius Archer
Shelby Nathan Yoder
Marin Alvarez
London Lindsey
Beau Tristan Bentley
Leo Gardner
Hunter Uriah Mathew Clarke
Mikayla Lopez
Frankie Conner Ritter
```

Running:

```bash
name-sorter ./unsorted-names-list.txt
```

Prints the following names and writes them to `sorted-names-list.txt`:

```text
Marin Alvarez
Adonis Julius Archer
Beau Tristan Bentley
Hunter Uriah Mathew Clarke
Leo Gardner
Vaughn Lewis
London Lindsey
Mikayla Lopez
Janet Parsons
Frankie Conner Ritter
Shelby Nathan Yoder
```

## Input rules

- Each line must contain one name.
- A name must contain one to three given names.
- A name must contain exactly one last name.
- The final word on each line is treated as the last name.
- Blank lines are ignored.
- Leading, trailing, and repeated whitespace is normalized.
- LF, CRLF, and CR line endings are supported.
- Invalid names stop processing and report the relevant line number.
- Empty or whitespace-only input produces an empty output file.
- Original spelling and capitalization are preserved.

## Running the tests

Run the complete test suite with:

```bash
npm test
```

The test suite covers:

- Names with one to three given names
- Invalid input
- Whitespace normalization
- Different line-ending formats
- Sorting by last name and given names
- Case-insensitive sorting
- Input-array immutability
- `PersonName` validation and immutability
- Console output
- Output-file creation and overwrite behavior
- Empty input files
- Missing command-line arguments
- Large input files containing 10,000 names

## Project structure

```text
NameSorterApplication/
├── bin/
│   └── name-sorter.js
├── src/
│   ├── file-system-name-repository.js
│   ├── name-parser.js
│   ├── name-sorter-application.js
│   ├── name-sorter.js
│   └── person-name.js
├── test/
│   ├── cli.test.js
│   ├── name-parser.test.js
│   ├── name-sorter-application.test.js
│   ├── name-sorter.test.js
│   └── person-name.test.js
├── .gitignore
├── package.json
├── package-lock.json
├── README.md
└── unsorted-names-list.txt
```

The generated `sorted-names-list.txt` file is excluded from Git because the application recreates it whenever it runs.

## Design

The application separates responsibilities into focused modules:

- `PersonName` represents and validates an immutable person name.
- `NameParser` converts file content into validated `PersonName` objects.
- `NameSorter` sorts names without modifying the original input array.
- `FileSystemNameRepository` handles reading and writing files.
- `NameSorterApplication` coordinates reading, parsing, sorting, displaying, and writing names.
- `bin/name-sorter.js` provides the command-line interface and error handling.

Dependencies are provided to `NameSorterApplication` through its constructor. This keeps the application logic independent from specific filesystem and console implementations, making the code easier to understand, test, maintain, and extend.

## Error handling

When the input-file argument is missing, the application displays:

```text
Usage: name-sorter <path-to-unsorted-names-file>
```

Invalid names report the corresponding line number. Filesystem errors, such as a missing input file, are displayed in the terminal, and the application exits unsuccessfully.