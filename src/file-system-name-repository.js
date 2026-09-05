import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

export const OUTPUT_FILE_NAME = 'sorted-names-list.txt';

/**
 * Owns file-system input and output so the application logic stays testable.
 */
export class FileSystemNameRepository {
  async read(inputPath) {
    return readFile(inputPath, 'utf8');
  }

  async write(names, outputDirectory = process.cwd()) {
    const outputPath = path.join(
      outputDirectory,
      OUTPUT_FILE_NAME,
    );

    const content =
      names.length === 0 ? '' : `${names.join('\n')}\n`;

    await writeFile(outputPath, content, 'utf8');

    return outputPath;
  }
}