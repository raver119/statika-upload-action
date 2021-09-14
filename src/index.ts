import core from "@actions/core";
import { Statika, StatikaApi, coordinates, authenticationBean } from "statika/build/";
import { parseStorage } from "./utilities";
import { uploadAllFilesInFolder } from "./upload";

async function run() {
  const token = core.getInput("token");
  const storage = core.getInput("storage");
  let bucket = core.getInput("bucket");
  const directory = core.getInput("directory");

  const coords = parseStorage(storage);
  const api: StatikaApi = Statika(coordinates(coords.schema, coords.host, coords.port));

  // if bucket variable is defined - use it. use coords.path otherwise
  // if both are undefined - throw error
  if (bucket === "") {
    if (coords.path === "") throw new Error("Bucket is undefined");

    bucket = coords.path;
  }

  // upload all files to the remote server
  await uploadAllFilesInFolder(api, authenticationBean(token, bucket), directory);
}

// invoke action, fail if something's wrong
run().catch((e) => core.setFailed(e.message));
