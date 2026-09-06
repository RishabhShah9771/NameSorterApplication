import { readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

export const OUTPUT_FILE_NAME = 'sorted-names-list.txt';

/**
 * Handles file-system operations separately from application logic,
 * making the application easier to test.
 */
export class FileSystemNameRepository {
  /**
   * Reads the complete input file as UTF-8 text.
   */
  async read(inputPath) {
    return readFile(inputPath, 'utf8');
  }

  /**
   * Writes the sorted names to the configured output directory.
   * Each name is written on a separate line.
   */
  async write(names, outputDirectory = process.cwd()) {
    const outputPath = join(outputDirectory, OUTPUT_FILE_NAME);

    // Add a final newline only when at least one name exists.
    const content = names.length > 0
      ? `${names.join('\n')}\n`
      : '';

    // Wait for the operation to finish before returning the file path.
    await writeFile(outputPath, content, 'utf8');

    return outputPath;
  }
}