import * as core from "@actions/core"
import {Statika, StatikaApi, coordinates, authenticationBean} from "statika/build/"
import {parseStorage} from "./utilities"
import {uploadAllFilesInFolder} from "./upload"

// seems to be required
global.XMLHttpRequest = require("w3c-xmlhttprequest").XMLHttpRequest

async function run() {
  const token = core.getInput("token")
  const storage = core.getInput("storage")
  let bucket = core.getInput("bucket")
  const directory = core.getInput("directory")
  const regex = core.getInput("regex")
  const verbose = core.getInput("verbose") === "true"

  const coords = parseStorage(storage)
  const api: StatikaApi = Statika(coordinates(coords.schema, coords.host, coords.port))

  // if bucket variable is defined - use it. use coords.path otherwise
  // if both are undefined - throw error
  if (bucket === "") {
    if (coords.path === "") throw new Error("Bucket is undefined")

    bucket = coords.path
  }

  // upload all files to the remote server
  await uploadAllFilesInFolder(api, authenticationBean(token, bucket), directory, regex, verbose)
}

// invoke action, fail if something's wrong
run().catch(e => {
  console.log(e)
  core.setFailed(`Action failed with exception: ${e.message}`)
})
