import { Namespace } from '../types/namespace'

import { GitLabGroup } from '@/api/gitlab/types/gitlab-group'

export const normalizeNamespace = (raw: GitLabGroup): Namespace => {
  return {
    id: raw.id,
    path: raw.full_name,
  }
}
