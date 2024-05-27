import { UpdateGitLabProject } from '@/modules/gitlab/client/functions/update-project'
import { GitLabService } from '@/modules/gitlab/gitlab-service'

import { createLogger } from '@/utils/logging/create-logger'

import { normalizeProject } from '../normalizers/normalize-project'
import { ProjectDetailsStore } from '../project-details-store'
import { ProjectsStore } from '../projects-store'

import { syncProjectDetails } from './sync-project-details'

const logger = createLogger('update-project')

export const updateProject =
  (
    service: GitLabService,
    projectsStore: ProjectsStore,
    detailsStore: ProjectDetailsStore
  ) =>
  async (id: number, payload: UpdateGitLabProject, token: string) => {
    logger.debug('updating...')
    detailsStore.setIsLoading(id, true)
    const project = await service.updateProject(id, payload, token)
    await Promise.all([
      syncProjectDetails(service, detailsStore)(id, 'network'),
      projectsStore.update(normalizeProject(project)),
    ])
    detailsStore.setIsLoading(id, false)
  }
