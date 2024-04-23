import { config } from '@/config'
import { LogLevel, Logger } from './types'

export const createLoggerFactory = (logLevel: LogLevel): Logger => {
  return (prefix) => ({
    debug: (...data) => {
      if (logLevel === 0) {
        console.debug(`[${prefix}]`, ...data)
      }
    },
    info: (...data) => {
      if (logLevel <= 1) {
        console.info(`[${prefix}]`, ...data)
      }
    },
    warn: (...data) => {
      if (logLevel <= 2) {
        console.warn(`[${prefix}]`, ...data)
      }
    },
    error: (...data) => {
      if (logLevel <= 3) {
        console.error(`[${prefix}]`, ...data)
      }
    },
  })
}

export const createLogger = createLoggerFactory(config.app.logLevel)
