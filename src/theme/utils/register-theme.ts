import { themeStore } from '@/modules/app/theme-store'

import { createLogger } from '@/utils/logging/create-logger'

const logger = createLogger('register-theme')

const DARK_THEME_CLASS = 'sl-theme-dark'
const LIGHT_THEME_CLASS = 'sl-theme-light'
const LOCAL_STORAGE_KEY = 'theme'

export enum Theme {
  Light = 'light',
  Dark = 'dark',
  System = 'system',
}

export const getTheme = (): Theme.Light | Theme.Dark => {
  const htmlElement = document.querySelector('html')
  return htmlElement?.classList.contains(LIGHT_THEME_CLASS)
    ? Theme.Light
    : Theme.Dark
}

export const setTheme = (theme: Theme.Light | Theme.Dark): void => {
  logger.debug(`setting theme to ${theme}`)
  const toRemove = theme === Theme.Dark ? LIGHT_THEME_CLASS : DARK_THEME_CLASS
  const toAdd = theme === Theme.Dark ? DARK_THEME_CLASS : LIGHT_THEME_CLASS

  const htmlElement = document.querySelector('html')
  htmlElement?.classList.remove(toRemove)
  htmlElement?.classList.add(toAdd)
  themeStore.setTheme(theme)
}

const parseTheme = (value: string): Theme => {
  switch (value.toLowerCase()) {
    case Theme.Light.toString():
      return Theme.Light
    case Theme.Dark.toString():
      return Theme.Dark
    default:
      return Theme.System
  }
}

export const setLocalStorage = (value: Theme): void => {
  localStorage.setItem(LOCAL_STORAGE_KEY, value)
}

export const fromLocalStorage = (): Theme => {
  const value = localStorage.getItem(LOCAL_STORAGE_KEY)
  if (!value) {
    logger.debug('theme not saved in localStorage, setting to "system"')
    localStorage.setItem(LOCAL_STORAGE_KEY, Theme.System)
    return Theme.System
  }

  const parsed = parseTheme(value)

  logger.debug(`theme set in localStorage: "${parsed}"`)
  return parsed
}

const supportsMatchMedia = () => {
  return typeof window.matchMedia !== 'undefined'
}

const fromBrowser = (): Theme.Dark | Theme.Light => {
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
  const theme = prefersDark ? Theme.Dark : Theme.Light
  logger.debug(`system preference: "${theme}"`)
  return theme
}

const watchForPreferenceChanges = () => {
  logger.debug('watching for preference changes...')
  window
    .matchMedia('(prefers-color-scheme: dark)')
    .addEventListener('change', (event) => {
      const theme = event.matches ? Theme.Dark : Theme.Light
      logger.debug(`theme preference changed to ${theme}, setting theme...`)
      setTheme(theme)
      return
    })
}

export const registerTheme = (mode: 'watch' | 'once' = 'watch'): void => {
  const valueFromLocalStorage = fromLocalStorage()

  if (valueFromLocalStorage !== Theme.System) {
    setTheme(valueFromLocalStorage)
    return
  }

  if (!supportsMatchMedia) {
    logger.debug(`browser doesn't support matchmedia`)
    setTheme(Theme.Light)
    return
  }

  const valueFromBrowser = fromBrowser()
  setTheme(valueFromBrowser)

  if (mode === 'watch') {
    watchForPreferenceChanges()
  }
}
