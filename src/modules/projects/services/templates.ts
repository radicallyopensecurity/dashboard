import { gitlabClient } from '@/api/gitlab/gitlab-client'

import { TEMPLATE_GROUP_PATH } from '../constants/namespaces'
import { normalizeTemplate } from '../normalizers/normalize-template'
import { Template } from '../types/template'

export const templates = async (): Promise<Template[]> => {
  const projects = await gitlabClient.groupProjects({
    path: TEMPLATE_GROUP_PATH,
    scope: 'projects',
  })
  const normalized = projects.map(normalizeTemplate)
  return normalized
}
