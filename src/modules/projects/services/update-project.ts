import { UpdateGitLabProject } from '@/api/gitlab/client/update-project'
import { GitLabClient } from '@/api/gitlab/gitlab-client'

import { createLogger } from '@/utils/logging/create-logger'

import { normalizeProject } from '../normalizers/normalize-project'
import { ProjectDetailsStore } from '../store/project-details-store'
import { ProjectsStore } from '../store/projects-store'

import { syncProjectDetails } from './sync-project-details'

const logger = createLogger('update-project')

export const updateProject =
  (
    client: GitLabClient,
    projectsStore: ProjectsStore,
    detailsStore: ProjectDetailsStore
  ) =>
  async (id: number, payload: UpdateGitLabProject) => {
    logger.debug('updating...')
    detailsStore.setIsLoading(id, true)
    const project = await client.updateProject(id, payload)
    await Promise.all([
      syncProjectDetails(client, detailsStore)(id, 'network'),
      projectsStore.update(normalizeProject(project)),
    ])
    detailsStore.setIsLoading(id, false)
  }
