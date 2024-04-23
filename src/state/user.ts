import { observable, action, makeAutoObservable } from 'mobx'
import { OidcUserInfo } from '@axa-fr/oidc-client'

class UserState {
  @observable
  public name: string = ''
  @observable
  public groups: string[] = []

  constructor() {
    makeAutoObservable(this)
  }

  @action
  public set(userInfo: OidcUserInfo) {
    this.name = userInfo.preferred_username ?? 'username_undefined'
    this.groups = userInfo.groups ?? []
  }
}

export const user = new UserState()
