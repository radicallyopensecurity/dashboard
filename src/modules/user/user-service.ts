import { gitlabClient } from '@/api/gitlab/gitlab-client'

import { authClient } from '@/modules/auth/client/auth-client'

import { syncUser } from '@/modules/user/services/sync-user'
import { user } from '@/modules/user/user-store'


export const userService = {
  syncUser: syncUser(authClient, gitlabClient, user),
}
