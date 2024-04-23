import { vi, test, expect } from 'vitest'

import { createLoggerFactory } from '@/utils/logging/create-logger'
import { LogLevel } from '@/utils/logging/types'

type Case = [LogLevel, 'debug' | 'info' | 'warn' | 'error', boolean]

const cases: Case[] = [
  [LogLevel.DEBUG, 'debug', true],
  [LogLevel.DEBUG, 'info', true],
  [LogLevel.DEBUG, 'warn', true],
  [LogLevel.DEBUG, 'error', true],
  [LogLevel.INFO, 'debug', false],
  [LogLevel.INFO, 'info', true],
  [LogLevel.INFO, 'warn', true],
  [LogLevel.INFO, 'error', true],
  [LogLevel.WARN, 'debug', false],
  [LogLevel.WARN, 'info', false],
  [LogLevel.WARN, 'warn', true],
  [LogLevel.WARN, 'error', true],
  [LogLevel.ERROR, 'debug', false],
  [LogLevel.ERROR, 'info', false],
  [LogLevel.ERROR, 'warn', false],
  [LogLevel.ERROR, 'error', true],
]

test.each(cases)(
  'Log level %s calls %s = %s',
  (logLevel, logFunction, shouldBeCalled) => {
    const createLogger = createLoggerFactory(logLevel)
    const logger = createLogger('test')
    const loggerSpy = vi.spyOn(console, logFunction)

    logger[logFunction]('test')

    shouldBeCalled
      ? expect(loggerSpy).toHaveBeenCalled()
      : expect(loggerSpy).not.toHaveBeenCalled()
  }
)
