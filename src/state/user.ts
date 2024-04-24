import { observable, action, makeAutoObservable } from 'mobx'

import { authClient } from '@/auth/auth-client'

import { gitlabClient } from '@/api/gitlab/gitlab-client'

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
  public async getUserInfo() {
    const userInfo = await authClient.userInfoAsync()
    this.name = userInfo.preferred_username ?? 'username_undefined'
    this.groups = userInfo.groups ?? []
  }

  @action
  async getGitLabUser() {
    const gitlabUser = await gitlabClient.user()
    this.avatar = gitlabUser.avatar_url
  }
}

export const user = new UserState()
