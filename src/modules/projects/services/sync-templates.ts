import { GitLabClient } from '@/api/gitlab/gitlab-client'

import { TEMPLATE_GROUP_PATH } from '../constants/namespaces'
import { normalizeTemplate } from '../normalizers/normalize-template'
import { TemplatesStore } from '../store/templates-store'

export const syncTemplates =
  (service: GitLabClient, store: TemplatesStore) => async () => {
    store.setIsLoading(true)
    const projects = await service.groupProjects({
      path: TEMPLATE_GROUP_PATH,
      scope: 'projects',
    })
    const normalized = projects.map(normalizeTemplate)
    store.setTemplates(normalized)
    store.setIsLoading(false)
  }
