import fs from 'fs';
import path from 'path';
import {AuthenticationBean, StatikaApi} from 'statika';
import "whatwg-fetch"

export async function uploadAllFilesInFolder(api: StatikaApi, bean: AuthenticationBean,  directory: string) {
    // get list of files in the specified directory
    const files = fs.readdirSync(directory)
    if (files.length === 0)
        throw new Error(`Directory [${directory}] has no files in it!`);
    
    // and upload them one by one
    for (let file of files) {
        const absolute = path.join(directory, file)
        const content = fs.readFileSync(absolute)
        const response = await api.storage.uploadFile(bean, file, content)
        console.log(`Uploaded ${file} => ${response.filename}`)
    }

    return true
}