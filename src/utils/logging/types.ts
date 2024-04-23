export enum LogLevel {
  DEBUG,
  INFO,
  WARN,
  ERROR,
}

export type LogFn = (...data: any[]) => void

export type Logger = (prefix: string) => {
  debug: LogFn
  info: LogFn
  warn: LogFn
  error: LogFn
}
