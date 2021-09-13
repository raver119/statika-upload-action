import "whatwg-fetch"
import {describe, test, expect, beforeAll, afterEach} from "@jest/globals"
import { AuthenticationBean, coordinates, Statika} from "statika"
import { uploadAllFilesInFolder } from "../upload"
import fs from 'fs'
import os from 'os'
import path from "path"
import {v4 as uuid} from "uuid";

const api = Statika(coordinates("http", process.env.STATIKA_HOST ?? "localhost", process.env.STATIKA_PORT ?? 7070))
const bucket = "test_bucket_upload_21"

console.log(`Statika endpoint: ${process.env.STATIKA_HOST}:${process.env.STATIKA_PORT}`)

let bean: AuthenticationBean
beforeAll(async () => {
    console.log("Trying to issue token")
    bean = await api.system.issueToken(process.env.UPLOAD_KEY, bucket)
    console.log("Bean: ", bean)
})

afterEach(async () => {
    // delete all files uploaded to the bucket
    const response = await api.storage.listFiles(bean)
    if (response.files !== null) {
        for (let f of response.files) {
            //console.log(`Deleting file: ${f.filename}`)
            await api.storage.deleteFile(bean, `/${bean.bucket}/${f.filename}`)
        }
    }
})

describe("Upload", () => {
    test("no directory", async () => {
        await expect(uploadAllFilesInFolder(api, bean, `${Math.random()}`)).rejects.toThrow(/no such file or directory/)
    })

    test("empty directory", async () => {
        const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'empty-'))
        await expect(uploadAllFilesInFolder(api, bean, tmp)).rejects.toThrow(/has no files in it/)
        fs.rmdirSync(tmp)
    })

    test("single file", async () => {
        const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'single-'))
        const files = putRandomFiles(tmp, 1)

        await expect(uploadAllFilesInFolder(api, bean, tmp)).resolves.toBeTruthy()
        const stored = await api.storage.listFiles(bean)
        expect(stored.files.length).toBe(1)
        expect(stored.files[0].filename).toBe(files[0])
        
        fs.rmSync(tmp, {recursive: true})
    })

    test("multiple files", async () => {
        const num = 3
        const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'multiple-'))
        const files = putRandomFiles(tmp, num)

        await expect(uploadAllFilesInFolder(api, bean, tmp)).resolves.toBeTruthy()
        const stored = await api.storage.listFiles(bean)
        expect(stored.files.length).toBe(num)

        for (let file of stored.files)
            expect(files.find(f => f === file.filename)).toBeDefined()

        fs.rmSync(tmp, {recursive: true})
    })
})

function putRandomFiles(folder: string, num: number, content = "wow"): string[] {
    const result = []
    for (let i = 0; i < num; i++) {
        const name = `${uuid()}.txt`
        result.push(name)

        fs.writeFileSync(path.join(folder, name), content)
    }

    return result
}