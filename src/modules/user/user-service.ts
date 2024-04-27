import { authClient } from '@/modules/auth/client/auth-client'

import { gitlabService } from '@/modules/gitlab/gitlab-service'

import { syncUser } from '@/modules/user/services/sync-user'
import { user } from '@/modules/user/user-store'

export const userService = {
  syncUser: syncUser(authClient, gitlabService, user),
}
