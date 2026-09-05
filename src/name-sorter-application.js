/**
 * Coordinates input, parsing, sorting, console output, and file output.
 */
export class NameSorterApplication {
  constructor({ repository, parser, sorter, output }) {
    this.repository = repository;
    this.parser = parser;
    this.sorter = sorter;
    this.output = output;
  }

  async run(inputPath, outputDirectory = process.cwd()) {
    const content = await this.repository.read(inputPath);
    const names = this.parser.parseAll(content);

    const sortedNames = this.sorter
      .sort(names)
      .map(String);

    for (const name of sortedNames) {
      this.output.log(name);
    }

    return this.repository.write(
      sortedNames,
      outputDirectory,
    );
  }
}