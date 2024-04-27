import { type OidcClient } from '@axa-fr/oidc-client'

import { type GitLabService } from '@/modules/gitlab/gitlab-service'

import { type UserStore } from '@/modules/user/user-store'

export const syncUser =
  (authClient: OidcClient, gitlabService: GitLabService, store: UserStore) =>
  async () => {
    store.setIsLoading(true)
    const [userInfo, gitlabUser] = await Promise.all([
      authClient.userInfoAsync(),
      gitlabService.user(),
    ])
    store.fromUserInfo(userInfo)
    store.fromGitLabUser(gitlabUser)
    store.setIsLoading(false)
  }
