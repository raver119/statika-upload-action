export function filterFiles(regex: string, ...files: string[]): string[] {
  return files.filter(f => (regex === "" ? true : new RegExp(regex, "g").test(f)))
}
