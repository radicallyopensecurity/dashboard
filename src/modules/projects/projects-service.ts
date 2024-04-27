import { gitlabService } from '@/modules/gitlab/gitlab-service'

import { projectDetails } from '@/modules/projects/project-details-store'
import { projects } from '@/modules/projects/projects-store'
import { syncProjects } from '@/modules/projects/services/sync-projects'

import { syncProjectDetails } from './services/sync-project-details'

export const projectsService = {
  syncProjects: syncProjects(gitlabService, projects),
  syncProjectDetails: syncProjectDetails(gitlabService, projectDetails),
}
