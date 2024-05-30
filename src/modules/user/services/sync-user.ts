import { type OidcClient } from '@axa-fr/oidc-client'

import { type GitLabClient } from '@/api/gitlab/gitlab-client'

import { type UserStore } from '@/modules/user/user-store'


export const syncUser =
  (authClient: OidcClient, gitlabClient: GitLabClient, store: UserStore) =>
  async () => {
    store.setIsLoading(true)
    const [userInfo, gitlabUser] = await Promise.all([
      authClient.userInfoAsync(),
      gitlabClient.user(),
    ])
    store.fromUserInfo(userInfo)
    store.fromGitLabUser(gitlabUser)
    store.setIsLoading(false)
  }
