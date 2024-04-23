import { observable, action } from 'mobx'
import { OidcUserInfo } from '@axa-fr/oidc-client'

type User = {
  name: string
  groups: string[]
}

class UserState {
  @observable
  public user: User = {
    name: '',
    groups: [],
  }

  @observable
  public name: string = ''

  @action
  public set(userInfo: OidcUserInfo) {
    console.log({ userInfo })
    const newUser = {
      name: userInfo.preferred_username ?? 'username_undefined',
      groups: userInfo.groups ?? [],
    }
    console.log({ newUser })
    this.user = newUser
    this.name = userInfo.preferred_username ?? 'username_undefined'
  }
}

export const userState = new UserState()
