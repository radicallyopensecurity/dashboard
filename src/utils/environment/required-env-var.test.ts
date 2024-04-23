import { expect, it } from 'vitest'
import { requiredEnvVariable } from './required-env-var'

const KEY_VALUE_EXISTS = 'KEY_VALUE_EXISTS'

import.meta.env[KEY_VALUE_EXISTS] = KEY_VALUE_EXISTS
import.meta.env.KEY_EXISTS = ''

it('returns value of defined variable', () => {
  const value = requiredEnvVariable(KEY_VALUE_EXISTS)
  expect(value).toEqual(KEY_VALUE_EXISTS)
})

it('throws on empty variable', () => {
  expect(() => requiredEnvVariable('KEY_EXISTS')).toThrowError()
})

it('throws on undefined variable', () => {
  expect(() => requiredEnvVariable('KEY_DOESNT_EXIST]]')).toThrowError()
})
