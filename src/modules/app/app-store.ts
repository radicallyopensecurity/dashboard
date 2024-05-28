import { action, makeAutoObservable, observable } from 'mobx'

export class AppStore {
  @observable
  public gitlabToken = ''
  @observable
  public showGitlabTokenDialog = false

  constructor() {
    makeAutoObservable(this)
  }

  @action
  public setGitlabToken(value: string) {
    this.gitlabToken = value
  }

  @action
  public setGitlabTokenDialog(value: boolean) {
    this.showGitlabTokenDialog = value
  }
}

export const appStore = new AppStore()

export type AppStoreType = typeof appStore
