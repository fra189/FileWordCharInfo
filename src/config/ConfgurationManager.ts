import fs from 'fs/promises'

export type Configuration = {
    global?: {[key: string]: any}
    wordCharAnalyzer: {
        hypenChar?: string
        removePunctuation?: boolean
        wordPattern?: string
        minWordRepetition: number
    }
}

export default class ConfigurationManager {
    confFilePath: string = ''
    conf: Configuration = {
        wordCharAnalyzer: {
            hypenChar: '-',
            minWordRepetition: 10
        }
    }
    constructor(confFilePath?: string) {
        if (confFilePath) {
            this.confFilePath = confFilePath
        }
    }

    /**
     * Load configuration from file
     * 
     * @async
     * @example
     * await load()
     * 
     * @returns {Promise<void>} - Promise that resolves when configuration is loaded.
     * @throws {Error} - Error reading configuration file: *error message
     * .
     */
    async load(): Promise<void> {
        try {
            if (!this.confFilePath) {
                return
            }
            const data = await fs.readFile(this.confFilePath, { encoding: 'utf8' });
            this.conf = Object.assign(this.conf, JSON.parse(data));
        } catch (err) {
            throw new Error(`Error reading configuration file: ${err.message}`)
        }
    }

    /**
     * Get the current configuration
     * 
     * @example
     * getConfiguration()
     * 
     * @returns {Configuration} - The current configuration.
     */
    getConfiguration(): Configuration {
        return this.conf
    }
}