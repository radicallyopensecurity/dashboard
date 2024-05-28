import { authClient } from '@/modules/auth/client/auth-client'

import { syncUser } from '@/modules/user/services/sync-user'
import { user } from '@/modules/user/user-store'

import { gitlabService } from '@/api/gitlab/gitlab-service'

export const userService = {
  syncUser: syncUser(authClient, gitlabService, user),
}
