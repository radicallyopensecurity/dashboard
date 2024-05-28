import { type OidcClient } from '@axa-fr/oidc-client'

import { type UserStore } from '@/modules/user/user-store'

import { type GitLabService } from '@/api/gitlab/gitlab-service'

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
