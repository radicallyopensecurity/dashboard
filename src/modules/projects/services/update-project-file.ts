import { UpdateProjectFile } from '@/api/gitlab/client/update-project-file'
import { gitlabClient } from '@/api/gitlab/gitlab-client'

import { createLogger } from '@/utils/logging/create-logger'

import { normalizeProject } from '../normalizers/normalize-project'
import { Project } from '../types/project'

const logger = createLogger('update-project-file')

export const updateProjectFile = async (
  payload: UpdateProjectFile
): Promise<Project> => {
  logger.debug('updating project file...')
  const [project] = await Promise.all([
    gitlabClient.project({ id: payload.id }),
    gitlabClient.updateProjectFile(payload),
  ])

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
