import url from 'url'
import { describe, it, expect } from "@jest/globals"
import FileWordCharAnalyzer from "../src/core/fileWordCharAnalyzer"
import { Configuration } from '../src/config/ConfgurationManager'

const defConf: Configuration = {
    wordCharAnalyzer: {
        minWordRepetition: 10,
        removePunctuation: true,
        wordPattern: '.*[a-zA-Z0-9]+.*'
    }
}

const hypenConf: Configuration = {
    wordCharAnalyzer: {
        minWordRepetition: 1,
        removePunctuation: true,
        hypenChar: '-' ,
        wordPattern: '.*[a-zA-Z0-9]+.*'
    }
}


describe("FileWordCharAnalyzer", () => {
    it("getWordCharInfoFromText", () => {
        const fileWordCharAnalyzer = new FileWordCharAnalyzer()
        const text = "Hello world! Hello world!"
        const wordCharInfo = fileWordCharAnalyzer.getWordCharInfoFromText(text, defConf)
        expect(wordCharInfo.wordCount).toBe(4)
        expect(wordCharInfo.charCount).toBe(25)
        expect(wordCharInfo.letterCount).toBe(20)
        expect(wordCharInfo.spaceCount).toBe(3)
        expect(wordCharInfo.wordRepetitions).toEqual({
            "Hello": 2,
            "world": 2
        })
    }, 10000)
})

describe("FileWordCharAnalyzer", () => {
    it("getWordCharInfoFromText with hypenChar", () => {
        const fileWordCharAnalyzer = new FileWordCharAnalyzer()
        const text = "Hello world! Hel--lo world!"
        const wordCharInfo = fileWordCharAnalyzer.getWordCharInfoFromText(text, hypenConf)
        expect(wordCharInfo.wordCount).toBe(4)
        expect(wordCharInfo.charCount).toBe(25)
        expect(wordCharInfo.letterCount).toBe(20)
        expect(wordCharInfo.spaceCount).toBe(3)
        expect(wordCharInfo.wordRepetitions).toEqual({
            "Hello": 2,
            "world": 2
        })
    }, 10000)
})

describe("FileWordCharAnalyzer", () => {
    it("getWordCharInfoFromLocalFile", async () => {
        const fileWordCharAnalyzer = new FileWordCharAnalyzer()
        const fileUrl = url.pathToFileURL("./__tests__/assets/test")
        const wordCharInfo = await fileWordCharAnalyzer.getWordCharInfoFromFile(fileUrl, defConf)
        expect(wordCharInfo.wordCount).toBe(36)
        expect(wordCharInfo.charCount).toBe(229)
        expect(wordCharInfo.letterCount).toBe(191)
        expect(wordCharInfo.spaceCount).toBe(33)
    }, 10000)
})

describe("FileWordCharAnalyzer", () => {
    it("getWordCharInfoFromLocalFile With hyphen", async () => {
        const fileWordCharAnalyzer = new FileWordCharAnalyzer()
        const fileUrl = url.pathToFileURL("./__tests__/assets/test_hyphen")
        const wordCharInfo = await fileWordCharAnalyzer.getWordCharInfoFromFile(fileUrl, hypenConf)
        expect(wordCharInfo.wordCount).toBe(36)
        expect(wordCharInfo.charCount).toBe(229)
        expect(wordCharInfo.letterCount).toBe(191)
        expect(wordCharInfo.spaceCount).toBe(33)
    }, 10000)
})

describe("FileWordCharAnalyzer", () => {
    it("getWordCharInfoFromLocalFile hypen file without hyphen enabled", async () => {
        const fileWordCharAnalyzer = new FileWordCharAnalyzer()
        const fileUrl = url.pathToFileURL("./__tests__/assets/test_hyphen")
        const wordCharInfo = await fileWordCharAnalyzer.getWordCharInfoFromFile(fileUrl)
        expect(wordCharInfo.wordCount).toBe(38)
        expect(wordCharInfo.letterCount).toBe(191)
        expect(wordCharInfo.spaceCount).toBe(33)
    }, 10000)
})

describe("FileWordCharAnalyzer", () => {
    it("getWordCharInfoFromRemoteFile", async () => {
        const fileWordCharAnalyzer = new FileWordCharAnalyzer()
        const fileUrl = new URL("https://raw.githubusercontent.com/torvalds/linux/master/README")
        const wordCharInfo = await fileWordCharAnalyzer.getWordCharInfoFromFile(fileUrl)
        expect(wordCharInfo.wordCount).toBe(97)
        expect(wordCharInfo.charCount).toBe(708)
        expect(wordCharInfo.letterCount).toBe(570)
        expect(wordCharInfo.spaceCount).toBe(89)
    }, 10000)
})

// Run the test with the following command:
// yarn test