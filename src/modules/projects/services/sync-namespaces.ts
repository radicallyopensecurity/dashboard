import { GitLabClient } from '@/api/gitlab/gitlab-client'

import { IGNORED_NAMESPACES_MAP } from '../constants/namespaces'
import { normalizeNamespace } from '../normalizers/normalize-namespace'
import { NamespacesStore } from '../store/namespaces-store'

export const syncNamespaces =
  (client: GitLabClient, store: NamespacesStore) => async () => {
    store.setIsLoading(true)
    const groups = await client.groups({
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
