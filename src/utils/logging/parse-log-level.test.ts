import { parseLogLevel } from '@/utils/logging/parse-log-level'
import { test, expect } from 'vitest'
import { LogLevel } from '@/utils/logging/types'

test.each([
  ['debug', LogLevel.DEBUG],
  ['DEBUG', LogLevel.DEBUG],
  ['info', LogLevel.INFO],
  ['INFO', LogLevel.INFO],
  ['warn', LogLevel.WARN],
  ['WARN', LogLevel.WARN],
  ['error', LogLevel.ERROR],
  ['ERROR', LogLevel.ERROR],
  ['FOO', LogLevel.WARN],
  ['', LogLevel.WARN],
])('%s => Log Level %s', (input, expected) => {
  const value = parseLogLevel(input)
  expect(value).toBe(expected)
})
