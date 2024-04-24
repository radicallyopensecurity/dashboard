import { createLogger } from '@/utils/logging/create-logger'

const logger = createLogger('register-theme')

const DARK_THEME_CLASS = 'sl-theme-dark'
const LIGHT_THEME_CLASS = 'sl-theme-light'

enum Theme {
  Light = 'light',
  Dark = 'dark',
  System = 'system',
}

const setTheme = (theme: Theme.Light | Theme.Dark): void => {
  logger.info(`setting theme to ${theme}`)
  const toRemove = theme === Theme.Dark ? LIGHT_THEME_CLASS : DARK_THEME_CLASS
  const toAdd = theme === Theme.Dark ? DARK_THEME_CLASS : LIGHT_THEME_CLASS

  const htmlElement = document.querySelector('html')
  htmlElement?.classList.remove(toRemove)
  htmlElement?.classList.add(toAdd)
}

const LOCAL_STORAGE_KEY = 'theme'

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

const fromLocalStorage = (): Theme => {
  logger.info('parsing theme from localStorage')

  const value = localStorage.getItem(LOCAL_STORAGE_KEY)
  if (!value) {
    logger.info('theme not saved in localStorage, setting to "system"')
    localStorage.setItem(LOCAL_STORAGE_KEY, Theme.System)
    return Theme.System
  }

  const parsed = parseTheme(value)

  logger.info(`parsed theme ${parsed}`)
  return parsed
}

const supportsMatchMedia = () => {
  return typeof window.matchMedia !== 'undefined'
}

const fromBrowser = (): Theme.Dark | Theme.Light => {
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
  const theme = prefersDark ? Theme.Dark : Theme.Light
  logger.info(`user prefers ${theme} theme`)
  return theme
}

const watchForPreferenceChanges = () => {
  logger.info('watching for preference changes...')
  window
    .matchMedia('(prefers-color-scheme: dark)')
    .addEventListener('change', (event) => {
      const theme = event.matches ? Theme.Dark : Theme.Light
      logger.info(`theme preference changed to ${theme}, setting theme...`)
      setTheme(theme)
      return
    })
}

export const registerTheme = (): void => {
  logger.info('check localStorage for theme preference')
  const valueFromLocalStorage = fromLocalStorage()

  logger.info(`localStorage theme: "${valueFromLocalStorage}"`)

  if (
    valueFromLocalStorage === Theme.Light ||
    valueFromLocalStorage === Theme.Dark
  ) {
    setTheme(valueFromLocalStorage)
    return
  }

  if (!supportsMatchMedia) {
    logger.info(`browser doesn't support matchmedia`)
    setTheme(Theme.Light)
    return
  }

  logger.info('check system for color preferences')
  const valueFromBrowser = fromBrowser()
  setTheme(valueFromBrowser)

  watchForPreferenceChanges()
}
