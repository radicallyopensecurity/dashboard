import { OidcUserInfo } from '@axa-fr/oidc-client'
import { observable, action, makeAutoObservable } from 'mobx'

import { GitLabUser } from '@/modules/gitlab/types/gitlab-user'

export class UserStore {
  @observable
  public name = ''
  @observable
  public groups: string[] = []
  @observable
  public avatar: string | null = null

  @observable
  public isLoading = true

  constructor() {
    makeAutoObservable(this)
  }

  @action
  public setIsLoading(value: boolean) {
    this.isLoading = value
  }

  @action
  public fromUserInfo(userInfo: OidcUserInfo) {
    this.name = userInfo.preferred_username ?? 'username_undefined'
    this.groups = userInfo.groups ?? []
  }

  @action
  public fromGitLabUser(gitlabUser: GitLabUser) {
    this.avatar = gitlabUser.avatar_url
  }
}

export const user = new UserStore()
