import fs from "fs"
import path from "path"
import {AuthenticationBean, StatikaApi} from "statika"
import "whatwg-fetch"
import {filterFiles} from "./filter"
import {readDirectoryRecursively} from "./scanner"

export async function uploadAllFilesInFolder(
  api: StatikaApi,
  bean: AuthenticationBean,
  directory: string,
  regex: string = "",
  verbose: boolean = false
) {
  // get list of files in the specified directory
  const files = readDirectoryRecursively(directory, verbose)
  if (files.length === 0) throw new Error(`Directory [${directory}] has no files in it!`)

  // and upload them one by one as a set of promises
  const promises = filterFiles(regex, ...files).map(file => {
    const absolute = path.join(directory, file)
    const content = fs.readFileSync(absolute)
    if (verbose) console.log(`Uploading ${file} => /${bean.bucket}/${file}`)
    return api.storage.uploadFile(bean, file, content)
  })

  // wait till all promises resolve
  ;(await Promise.all(promises)).map(r => {
    if (verbose) console.log(`Successfully uploaded ${r.filename}`)
  })

  return true
}
