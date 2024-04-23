import { LogLevel } from './types'

export const parseLogLevel = (level: string | undefined): LogLevel => {
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
