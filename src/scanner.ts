import fs from "fs"
import path from "path"

/**
 * This function scans given directly recursively, and return list of files relative to entry folder
 * @param directory
 * @returns list of file names, relative to the directoy
 */
export function readDirectoryRecursively(directory: string): string[] {
  // scan files recursively AND make paths relative
  return isDirectory(directory)
    ? _readDirectoryRecursively(directory).map(d => d.replace(`${directory}${path.sep}`, ""))
    : [directory]
}

function _readDirectoryRecursively(directory: string): string[] {
  const result: string[] = []
  const initial = fs.readdirSync(directory)

  for (let entry of initial) {
    const absolute = path.join(directory, entry)
    if (isDirectory(absolute)) {
      result.push(..._readDirectoryRecursively(absolute))
    } else {
      result.push(absolute)
    }
  }

  return result
}

function isDirectory(path: string): boolean {
  const stats = fs.statSync(path)
  return stats.isDirectory()
}
