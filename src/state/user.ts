import { OidcUserInfo } from '@axa-fr/oidc-client'
import { observable, action, makeAutoObservable } from 'mobx'

class UserState {
  @observable
  public name = ''
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
