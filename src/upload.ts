import fs from "fs";
import path from "path";
import { AuthenticationBean, StatikaApi } from "statika";
import "whatwg-fetch";

export async function uploadAllFilesInFolder(api: StatikaApi, bean: AuthenticationBean, directory: string) {
  // get list of files in the specified directory
  const files = fs.readdirSync(directory);
  if (files.length === 0) throw new Error(`Directory [${directory}] has no files in it!`);

  // and upload them one by one as a set of promises
  const promises = files.map((file) => {
    const absolute = path.join(directory, file);
    const content = fs.readFileSync(absolute);
    console.log(`Uploading ${file} => /${bean.bucket}/${file}`);
    return api.storage.uploadFile(bean, file, content);
  });

  // wait till all promises resolve
  (await Promise.all(promises)).map((r) => console.log(`Successfully uploaded ${r.filename}`));

  return true;
}
