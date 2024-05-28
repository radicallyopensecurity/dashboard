import { IGNORED_NAMESPACES_MAP } from '../constants/namespaces'
import { NamespacesStore } from '../namespaces-store'
import { normalizeNamespace } from '../normalizers/normalize-namespace'

import { GitLabService } from '@/api/gitlab/gitlab-service'

export const syncNamespaces =
  (service: GitLabService, store: NamespacesStore) => async () => {
    store.setIsLoading(true)
    const groups = await service.groups({
      allAvailable: true,
      minAccessLevel: 40,
    })
    const filtered = groups.filter(
      (group) => !IGNORED_NAMESPACES_MAP[group.full_path]
    )
    const normalized = filtered.map(normalizeNamespace)
    store.setGroups(normalized)
    store.setIsLoading(false)
  }
