/**
 * Coordinates reading, parsing, sorting, and displaying names.
 */
export class NameSorterApplication {
  constructor({ repository, parser, sorter, output }) {
    // Dependencies are injected to keep the application testable
    // and independent of specific file or console implementations.
    this.repository = repository;
    this.parser = parser;
    this.sorter = sorter;
    this.output = output;
  }

  async run(inputPath, outputDirectory = process.cwd()) {
    // Read and validate the names from the input file.
    const content = await this.repository.read(inputPath);
    const names = this.parser.parseAll(content);

    // Sort the PersonName objects and convert them to output strings once.
    const sortedNames = this.sorter
      .sort(names)
      .map((name) => name.toString());

    // Display each sorted name in the console.
    for (const name of sortedNames) {
      this.output.log(name);
    }

    // Write the same sorted names to the output file.
    return this.repository.write(sortedNames, outputDirectory);
  }
}