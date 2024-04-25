import { OidcUserInfo } from '@axa-fr/oidc-client'
import { observable, action, makeAutoObservable } from 'mobx'

import { GitLabUser } from '@/api/gitlab/types/gitlab-user'

class UserState {
  @observable
  public name = ''
  @observable
  public groups: string[] = []
  @observable
  public avatar: string | null = null

  constructor() {
    makeAutoObservable(this)
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

export const user = new UserState()
