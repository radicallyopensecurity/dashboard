export enum LogLevel {
  DEBUG,
  INFO,
  WARN,
  ERROR,
}

// safe to ignore
// console log function parameter is defined as any[]
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type LogFn = (...data: any[]) => void

export type Logger = (prefix: string) => {
  debug: LogFn
  info: LogFn
  warn: LogFn
  error: LogFn
}
