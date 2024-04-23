import { LogFn, LogLevel, Logger } from '@/utils/logging//types'

import { config } from '@/config'

// eslint-disable-next-line @typescript-eslint/no-empty-function
const noOp = () => {}

const logWith =
  (logLevel: 'debug' | 'info' | 'warn' | 'error', prefix: string): LogFn =>
  (...data) =>
    // safe to ignore
    // console log function parameter is defined as any[]
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    console[logLevel](`[${prefix}]`, ...data)

export const createLoggerFactory = (logLevel: LogLevel): Logger => {
  return (prefix) => {
    const debug = logLevel === LogLevel.DEBUG ? logWith('debug', prefix) : noOp
    const info = logLevel <= LogLevel.INFO ? logWith('info', prefix) : noOp
    const warn = logLevel <= LogLevel.WARN ? logWith('warn', prefix) : noOp
    const error = logWith('error', prefix)

    return {
      debug,
      info,
      warn,
      error,
    }
  }
}

export const createLogger = createLoggerFactory(config.app.logLevel)
