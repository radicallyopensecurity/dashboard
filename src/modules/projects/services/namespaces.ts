import { gitlabClient } from '@/api/gitlab/gitlab-client'

import { IGNORED_NAMESPACES_MAP } from '../constants/namespaces'
import { normalizeNamespace } from '../normalizers/normalize-namespace'

export const namespaces = async () => {
  const groups = await gitlabClient.groups({
    allAvailable: true,
    minAccessLevel: 10,
  })
  const filtered = groups.filter(
    (group) => !IGNORED_NAMESPACES_MAP[group.full_path]
  )
  const normalized = filtered.map(normalizeNamespace)
  return normalized
}
