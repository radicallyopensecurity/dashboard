import { action, makeAutoObservable, observable } from 'mobx'

export class AuthStore {
  @observable
  public isAuthenticated = false

  constructor() {
    makeAutoObservable(this)
  }

  @action
  public setAuthenticated(value: boolean) {
    this.isAuthenticated = value
  }
}

export const auth = new AuthStore()
