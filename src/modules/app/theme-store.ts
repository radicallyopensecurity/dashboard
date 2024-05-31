import { action, makeAutoObservable, observable } from 'mobx'

import { Theme } from '@/theme/utils/register-theme'

export class ThemeStore {
  @observable
  public theme = 'light'

  constructor() {
    makeAutoObservable(this)
  }

  @action
  public setTheme(theme: Theme) {
    this.theme = theme
  }
}

export const themeStore = new ThemeStore()

export type ThemeStoreType = typeof themeStore
