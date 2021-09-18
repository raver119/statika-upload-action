import {describe, test, expect} from "@jest/globals"
import path from "path"
import fs from "fs"
import os from "os"
import {putRandomFiles} from "./helpers"
import {readDirectoryRecursively} from "../scanner"

describe("Scanner tests", () => {
  test("no nested folders", async () => {
    const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "no-nested-"))
    const files = putRandomFiles(tmp, 3)

    const scanned = readDirectoryRecursively(tmp)
    expect(scanned.map(d => files.find(f => d == f) === d)).toStrictEqual([true, true, true])
  })

  test("single nested folder", async () => {
    const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "single-nested-"))
    const tmpNested = fs.mkdtempSync(path.join(tmp, "sub-"))
    const subFolder = tmpNested.replace(`${tmp}${path.sep}`, "")
    const files = putRandomFiles(tmpNested, 3).map(f => `${subFolder}${path.sep}${f}`)

    const scanned = readDirectoryRecursively(tmp)
    expect(scanned.map(d => files.find(f => d == f) === d)).toStrictEqual([true, true, true])
  })

  test("multiple nested folders", async () => {
    const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "single-nested-"))
    const tmpNested = fs.mkdtempSync(path.join(tmp, "sub-"))
    const tmpSubNested = fs.mkdtempSync(path.join(tmpNested, "under-"))
    const subFolder = tmpNested.replace(`${tmp}${path.sep}`, "")
    const subNestedFolder = tmpSubNested.replace(`${tmp}${path.sep}`, "")
    const filesA = putRandomFiles(tmpNested, 2).map(f => `${subFolder}${path.sep}${f}`)
    const filesB = putRandomFiles(tmpSubNested, 2).map(f => `${subNestedFolder}${path.sep}${f}`)

    const scanned = readDirectoryRecursively(tmp)
    expect(scanned.map(d => filesA.find(f => d == f) === d || filesB.find(f => d == f) === d)).toStrictEqual([
      true,
      true,
      true,
      true,
    ])
  })
})
