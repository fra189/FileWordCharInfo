import readline from 'readline'
import fs from 'fs'
import Utils from "../utils/utils"
import Logger from '../log/logger'
import { Configuration } from '../config/ConfgurationManager'

export type WordCharInfo = {
    wordCount: number
    charCount: number
    letterCount: number
    spaceCount: number
    wordRepetitions: { [word: string]: number }
}

export default class FileWordCharAnalyzer {
    
    private readChunks(reader: ReadableStreamDefaultReader<Uint8Array>) {
        return {
            async* [Symbol.asyncIterator]() {
                let readResult = await reader.read();
                while (!readResult.done) {
                    yield readResult.value;
                    readResult = await reader.read();
                }
            }
        }
    }

    /**
     * Get word and char info from a file
     * 
     * @async
     * @example
     * getWordCharInfoFromFile(fileUrl)
     * 
     * @param fileUrl {URL} - The file URL.
     * @param conf Optional {Configuration} - The configuration.
     * 
     * @returns {Promise<WordCharInfo>} - The word and char info.
     * 
     * @throws {Error} - File URL is required
     */
    async getWordCharInfoFromFile(fileUrl: URL, conf?: Configuration): Promise<WordCharInfo> {
        Logger.info(`Trying to get word and char info from file: ${fileUrl}`)
        if (!fileUrl) {
            throw new Error('File URL is required')
        }
        if (fileUrl.protocol === 'file:') {
            return this.getWordCharInfoFromLocalFile(fileUrl, conf)
        } else {
            return this.getWordCharInfoFromRemoteFile(fileUrl, conf)
        }
    }

    /**
     * Get word and char info from a local file
     * 
     * @async
     * @example
     * getWordCharInfoFromLocalFile(fileUrl)
     * 
     * @param fileUrl {URL} - The file URL.
     * @param conf Optional {Configuration} - The configuration.
     * @returns {Promise<WordCharInfo>} - The word and char info.
     *  
     */
    async getWordCharInfoFromLocalFile(fileUrl: URL, conf?: Configuration): Promise<WordCharInfo> {
        Logger.info(`Got request to get word and char info local file: ${fileUrl}`)
        return new Promise((resolve, reject) => {
            try {
                let result: WordCharInfo = {
                    wordCount: 0,
                    charCount: 0,
                    letterCount: 0,
                    spaceCount: 0,
                    wordRepetitions: {}
                }
                let lineBuffer = ''
                let hypenChar = conf?.wordCharAnalyzer?.hypenChar
                const lineReader = readline.createInterface({
                    input: fs.createReadStream(fileUrl)
                })

                lineReader.on('line', line => {
                    Logger.debug(`Read line: ${line}, has newline: ${line.endsWith('\n')}`)
                    lineBuffer += line
                    if (hypenChar) {
                        if (lineBuffer.endsWith(hypenChar)) {
                            Logger.debug(`Line ends with hypenChar: ${hypenChar}`)
                            return
                        } else {
                            this.updateWordCharInfo(result, lineBuffer, conf)
                        }
                    } else {
                        this.updateWordCharInfo(result, lineBuffer, conf)
                    }
                    lineBuffer = ''
                })
                
                lineReader.on('close', () => {
                    if (lineBuffer) {
                        this.updateWordCharInfo(result, lineBuffer, conf)
                    }
                    Logger.info('Finished reading file')
                    Logger.debug(`Result: ${JSON.stringify(result)}`)
                    resolve(result)
                })

                lineReader.on('error', reject)
            } catch (error) {
                reject(error)
            }
        })
    }
    

    /**
     * Get word and char info from a remote file
     * 
     * @async
     * @example
     * getWordCharInfoFromRemoteFile(fileUrl)
     * 
     * @param fileUrl {URL} - The file URL.
     * @param conf Optional {Configuration} - The configuration.
     * @returns {Promise<WordCharInfo>} - The word and char info.
     * 
     */
    async getWordCharInfoFromRemoteFile(fileUrl: URL, conf?: Configuration): Promise<WordCharInfo> {
        Logger.info(`Got request to get word and char info from remote URL: ${fileUrl}`)
        return new Promise((resolve, reject) => {
            let lineBuffer = ''
            let hypenChar = conf?.wordCharAnalyzer?.hypenChar
            let result: WordCharInfo = {
                wordCount: 0,
                charCount: 0,
                letterCount: 0,
                spaceCount: 0,
                wordRepetitions: {}
            }
            fetch(fileUrl).then(async response => {
                const reader = response.body?.getReader()
                for await (const chunk of this.readChunks(reader)) {
                    const text = new TextDecoder().decode(chunk)
                    lineBuffer += text
                    if (lineBuffer.includes('\n')) {
                        const lines = lineBuffer.split('\n')
                        lineBuffer = lines.pop() || ''
                        if (hypenChar) {
                            for (let i = 0; i < lines.length - 1; i++) {
                                if (lines[i].endsWith(hypenChar) && lines[i + 1].startsWith(hypenChar)) {
                                    lines[i] = lines[i].substring(0, lines[i].length - hypenChar.length)
                                    lines[i + 1] = lines[i + 1].substring(hypenChar.length)
                                    lines[i] += lines[i + 1]
                                    lines[i + 1] = ''
                                }
                            }
                        }
                        lines.forEach(line => {
                            this.updateWordCharInfo(result, line, conf)
                        })
                    }
                }
                if (lineBuffer) {
                    this.updateWordCharInfo(result, lineBuffer, conf)
                }
            })
            .then(() => {
                Logger.info('Finished reading file')
                Logger.debug(`Result: ${result}}`)
                resolve(result)
            })
            .catch(reject)
        })
    }

    private updateWordCharInfo(current: WordCharInfo, text: string, conf?: Configuration): void {
        const wordCharInfo = this.getWordCharInfoFromText(text, conf)
        current.wordCount += wordCharInfo.wordCount
        current.charCount += wordCharInfo.charCount
        current.letterCount += wordCharInfo.letterCount
        current.spaceCount += wordCharInfo.spaceCount
        for (const word in wordCharInfo.wordRepetitions) {
            if (current.wordRepetitions[word]) {
                current.wordRepetitions[word] += wordCharInfo.wordRepetitions[word]
            } else {
                current.wordRepetitions[word] = wordCharInfo.wordRepetitions[word]
            }
        }
    }


    /**
     * Get word and char info from text
     * 
     * @example
     * getWordCharInfoFromText(text)
     * 
     * @param text {string} - The text.
     * @param hypenChar Optional {string} - The hypen character to reconstruct hyphenated words.
     * @returns {WordCharInfo} - The word and char info.
     */ 
    getWordCharInfoFromText(text: string, conf?: Configuration): WordCharInfo {
        Logger.debug(`Analyzing text: ${text}`)
        const hypenChar = conf?.wordCharAnalyzer?.hypenChar
        const wordPattern = conf?.wordCharAnalyzer?.wordPattern
        const removePunctuation = conf?.wordCharAnalyzer?.removePunctuation
        const wordRepetitions: { [word: string]: number } = {}
        const letterCount = text.match(/\w/g)?.length || 0
        const spaceCount = text.match(/\s/g)?.length || 0
        text = Utils.newLineToSpace(text)
        if (hypenChar) { // Reconstruct hyphenated words
            text = text.replace(new RegExp(hypenChar + hypenChar, 'g'), '')
        }
        const words = text.split(/\s+/).filter(word => word.length > 0)
        Logger.debug(`Words: ${words}, Word count: ${words.length}`)
        let wordCount = 0
        words.forEach(word => {
            if (removePunctuation) {
                word = Utils.removePunctuation(word)
            }
            if (!word.match(new RegExp(wordPattern || '.*'))) {
                return
            }
            wordCount++
            if (wordRepetitions[word]) {
                wordRepetitions[word]++
            } else {
                wordRepetitions[word] = 1
            }
        })
        return {
            wordCount,
            charCount: text.length,
            letterCount,
            spaceCount,
            wordRepetitions
        }
    }
}