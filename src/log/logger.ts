export type LogLevel = {
    severity: number,
    tag: 'EMERGENCY' | 'ALERT' | 'CRITICAL' | 'ERROR' | 'WARNING' | 'NOTICE' | 'INFO' | 'DEBUG'
}

export const emerg:   LogLevel  = {severity: 0, tag: "EMERGENCY"}
export const alrt:    LogLevel  = {severity: 1, tag: "ALERT"}
export const crit:    LogLevel  = {severity: 2, tag: "CRITICAL"}
export const err:     LogLevel  = {severity: 3, tag: "ERROR"}
export const warning: LogLevel  = {severity: 4, tag: "WARNING"}
export const notice:  LogLevel  = {severity: 5, tag: "NOTICE"}
export const info:    LogLevel  = {severity: 6, tag: "INFO"}
export const debug:   LogLevel  = {severity: 7, tag: "DEBUG"}

export default class Logger {

    static findLogLevel(tag: string): LogLevel {
        switch (tag.toUpperCase()) {
            case 'EMERGENCY':
                return emerg
            case 'ALERT':
                return alrt
            case 'CRITICAL':
                return crit
            case 'ERROR':
                return err
            case 'WARNING':
                return warning
            case 'NOTICE':
                return notice
            case 'INFO':
                return info
            case 'DEBUG':
                return debug
            default:
                return info
        }
    }
  /**
   * Log method intended to be used in a journald 
   *
   * @static
   * @example
   * Logger.log(message, level)
   *
   * @param message {string} - Message to log.
   * @param level Optional {LogLevel} - log level.
   */
  static log(message: string, level?: LogLevel) {
    if (level) {
      if (global && global.minLogLevel) {
        if (level.severity > Logger.findLogLevel(global.minLogLevel).severity) {
          return
        }
      }
      console.log(`[${level.tag}]  ${message}`)
    } else {
      console.log(message)
    }
  }
  /**
   * shortcut method to emerg log 
   *
   * @static
   * @example
   * Logger.emerg(message)
   *
   * @param message {string} - Message to log.
   */
  static emerg(message) {
    Logger.log(message, emerg)
  }
  /**
   * shortcut method to alert log 
   *
   * @static
   * @example
   * Logger.alert(message)
   *
   * @param message {string} - Message to log.
   */
  static alert(message) {
    Logger.log(message, alrt)
  }
  /**
   * shortcut method to critical log 
   *
   * @static
   * @example
   * Logger.crit(message)
   *
   * @param message {string} - Message to Logger.log.
   */
  static crit(message) {
    Logger.log(message, crit)
  }
  /**
   * shortcut method to error log 
   *
   * @static
   * @example
   * Logger.err(message)
   *
   * @param message {string} - Message to log.
   */
  static err(message) {
    Logger.log(message, err)
  }
  /**
   * shortcut method to warning log 
   *
   * @static
   * @example
   * Logger.warn(message)
   *
   * @param message {string} - Message to log.
   */
  static warn(message) {
    Logger.log(message, warning)
  }
  /**
   * shortcut method to notice log 
   *
   * @static
   * @example
   * Logger.notice(message)
   *
   * @param message {string} - Message to log.
   */
  static notice(message) {
    Logger.log(message, notice)
  }
  /**
   * shortcut method to info log 
   *
   * @static
   * @example
   * Logger.info(message)
   *
   * @param message {string} - Message to log.
   */
  static info(message) {
    Logger.log(message, info)
  }
  /**
   * shortcut method to debug log 
   *
   * @static
   * @example
   * Logger.debug(message)
   *
   * @param message {string} - Message to log.
   */
  static debug(message) {
    Logger.log(message, debug)
  }
}
