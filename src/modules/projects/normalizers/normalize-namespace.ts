import { GitLabGroup } from '@/api/gitlab/types/gitlab-group'

import { Namespace } from '../types/namespace'

export const normalizeNamespace = (raw: GitLabGroup): Namespace => {
  return {
    id: raw.id,
    path: raw.full_name,
  }
}
