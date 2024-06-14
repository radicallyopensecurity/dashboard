import { gitlabClient } from '@/api/gitlab/gitlab-client'

import { authClient } from '@/modules/auth/client/auth-client'

import { User } from '@/modules/user/types/user'

export const getUser = async (): Promise<User> => {
  const [userInfo, gitlabUser] = await Promise.all([
    authClient.userInfoAsync(),
    gitlabClient.user(),
  ])

  return {
    name: userInfo.preferred_username ?? 'username_undefined',
    groups: userInfo.groups ?? [],
    avatar: gitlabUser.avatar_url,
  }
}
