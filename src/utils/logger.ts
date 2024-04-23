enum LogLevel {
  DEBUG,
  INFO,
  WARN,
  ERROR,
}

type LogFn = (...data: any[]) => void

type Logger = (prefix: string) => {
  debug: LogFn
  info: LogFn
  warn: LogFn
  error: LogFn
}

const parseLogLevel = (level: string | undefined): LogLevel => {
  switch (level?.toLowerCase()) {
    case 'debug':
      return LogLevel.DEBUG
    case 'info':
      return LogLevel.INFO
    case 'warn':
      return LogLevel.WARN
    case 'error':
      return LogLevel.ERROR
    default:
      return LogLevel.WARN
  }
}

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

export const createLogger = createLoggerFactory(
  parseLogLevel(import.meta.env['VITE_LOG_LEVEL'])
)
