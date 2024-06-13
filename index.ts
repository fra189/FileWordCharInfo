import path from 'path'
import url from 'url'
import { program } from 'commander'
import FileWordCharInfoApp from "./src/core/fileWordCharAnalyzerApp"
import Logger from './src/log/logger'

try {
    let confFilePath: string = path.join(__dirname, 'config', 'config.json')
    let fileUrl: URL = null
    program
        .option('-c, --config <config>', 'Configuration file path')
        .option('-f, --file <file>', 'File URL')
        .action((options) => {
            if (options.config) {
                confFilePath = options.config
            }
            if (options.file) {
                try {
                    fileUrl = new URL(options.file)
                }
                catch (err) {
                   fileUrl = url.pathToFileURL(options.file)
                }
            }
        })
        .parse(process.argv)
    const app = new FileWordCharInfoApp(fileUrl, confFilePath)
    app.run()
} catch (err) {
    Logger.err(`Error running FileWordCharInfoApp: ${err.message}`)
    process.exit(1)
}