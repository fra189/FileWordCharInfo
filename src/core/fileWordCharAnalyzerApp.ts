import FileWordCharAnalyzer, { WordCharInfo }  from './fileWordCharAnalyzer'
import ConfigurationManager, { Configuration } from '../config/ConfgurationManager'
import Logger from '../log/logger'

export default class FileWordCharInfoApp {
    private fileUrl: URL
    private FileWordCharAnalyzer: FileWordCharAnalyzer
    private confFilePath: string 
    private confManager: ConfigurationManager
    private conf: Configuration

    constructor(fileUrl: URL, confFilePath: string) {
        this.fileUrl = fileUrl
        this.confFilePath = confFilePath
        this.FileWordCharAnalyzer = new FileWordCharAnalyzer()
        this.confManager = new ConfigurationManager(this.confFilePath)
    }

    private async init() {
        Logger.info(`Initializing FileWordCharInfoApp for file: ${this.fileUrl}`)
        try {
            await this.confManager.load()
        } catch (err) {
            Logger.warn(`Error loading configuration file: ${err.message}`)
            Logger.info(`Using default configuration`)
        } finally {
            this.conf = this.confManager.getConfiguration()
            if (this.conf.global) {
                global = Object.assign(global, this.conf.global)
            }
        }
    }

    /**
     * Run the FileWordCharInfoApp
     *
     * @async
     * @example
     * run() 
     *
     * @returns {Promise<void>}
     */
    async run() {
        await this.init()
        Logger.info(`Running FileWordCharInfoApp for file: ${this.fileUrl}`)
        let hypenChar = this.conf.wordCharAnalyzer.hypenChar
        try {
            const wordCharInfo = await this.FileWordCharAnalyzer.getWordCharInfoFromFile(this.fileUrl, this.conf)
            this.printWordCharInfo(wordCharInfo)
        } catch (err) {
            Logger.err(`Error getting word and char info from file: ${err.message}`)
        }
    }

    private printWordCharInfo(wordCharInfo: WordCharInfo) {
        Logger.info(`Printing results for file: ${this.fileUrl}`)
        console.log(`Word count: ${wordCharInfo.wordCount}`)
        console.log(`Char count: ${wordCharInfo.charCount}`)
        console.log(`Space count: ${wordCharInfo.spaceCount}`)
        console.log(`Letter count: ${wordCharInfo.letterCount}`)
        console.log('Word repetitions:')
        let gotRepetitions = false
        for (const word in wordCharInfo.wordRepetitions) {
            if (wordCharInfo.wordRepetitions[word] < this.conf.wordCharAnalyzer.minWordRepetition) {
                continue
            }
            console.log(`  ${word}: ${wordCharInfo.wordRepetitions[word]}`)
            gotRepetitions = true
        }
        if (!gotRepetitions) {
            console.log(`  No word repeated for at least ${this.conf.wordCharAnalyzer.minWordRepetition} times found`)
        }
    }
}