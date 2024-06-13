export default class Utils {


    /**
     * Remove punctuation from a string
     * 
     * @static
     * @example
     * removePunctuation('Hello, World!')
     * @param str {string} - The string to remove punctuation from.
     * @param hypenChar Optional {string} - The hypen character to remove.
     * 
     * @returns {string} - The string without punctuation.
     * 
     */
    static removePunctuation(str: string, hypenChar?: string): string {
        let punctuation: string = '!"#$%&\'()*+,./-:;<=>?@[\\]^_`{|}~'
        if (hypenChar) {
            punctuation = punctuation.replace(new RegExp(hypenChar, 'g'), '')
        }
        return str.replace(new RegExp('[' + punctuation + ']', 'g'), '')
    }

    
    /**
     * Remove spaces from a string
     * 
     * @static
     * @example
     * removeSpaces('Hello, World!')
     * @param str {string} - The string to remove spaces from.
     * 
     * @returns {string} - The string without spaces. 
     */
    static removeSpaces(str: string): string {
        return str.replace(/\s/g, '')
    }


    /**
     * Remove numbers from a string
     * 
     * @static
     * @example
     * removeNumbers('Hello, World!')
     * @param str {string} - The string to remove numbers from.
     * 
     * @returns {string} - The string without numbers. 
     */
    static removeNumbers(str: string): string {
        return str.replace(/\d/g, '')
    }


    /**
     * Remove special characters from a string
     * 
     * @static
     * @example
     * removeSpecialChars('Hello, World!')
     * @param str {string} - The string to remove special characters from.
     * 
     * @returns {string} - The string without special characters. 
     */
    static removeSpecialChars(str: string): string {
        return str.replace(/[^\w\s]/gi, '')
    }


    /**
     * Remove new lines from a string
     * 
     * @static
     * @example
     * removeNewLines('Hello, World!')
     * @param str {string} - The string to remove new lines from.
     * 
     * @returns {string} - The string without new lines. 
     */
    static removeNewLines(str: string): string {
        return str.replace(/\n/g, '')
    }


    /**
     * Replace new lines with spaces in a string
     * 
     * @static
     * @example
     * newLineToSpace('Hello, World!')
     * @param str {string} - The string to replace new lines with spaces.
     * 
     * @returns {string} - The string with new lines replaced with spaces.
     */
    static newLineToSpace(str: string): string {
        return str.replace(/\n/g, ' ')
    }
}