import { UpdateGitLabProject } from '@/api/gitlab/client/update-project'
import { gitlabClient } from '@/api/gitlab/gitlab-client'

import { createLogger } from '@/utils/logging/create-logger'

import { normalizeProject } from '../normalizers/normalize-project'
import { Project } from '../types/project'

const logger = createLogger('update-project')

export const updateProject = async (
  id: number,
  payload: UpdateGitLabProject
): Promise<Project> => {
  logger.debug('updating project...')
  const project = await gitlabClient.updateProject(id, payload)

  let quote = null
  try {
    quote = await gitlabClient.projectFile({
      id: project.id,
      path: 'source/offerte.xml',
      branch: 'main',
    })
  } catch (err) {
    /* empty */
  }

  const normalized = normalizeProject(project, quote)
  return normalized
}
