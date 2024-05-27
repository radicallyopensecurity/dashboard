import { config } from '@/config'

import { gitlabService } from '@/modules/gitlab/gitlab-service'

import { projectDetails } from '@/modules/projects/project-details-store'
import { projects } from '@/modules/projects/projects-store'
import { syncProjects } from '@/modules/projects/services/sync-projects'

import { projectFindingsStore } from './project-findings-store'
import { syncProjectDetails } from './services/sync-project-details'
import { syncProjectFinding } from './services/sync-project-finding'
import { updateProject } from './services/update-project'

export const projectsService = {
  syncProjects: syncProjects(gitlabService, projects),
  syncProjectDetails: syncProjectDetails(gitlabService, projectDetails),
  syncProjectFinding: syncProjectFinding(
    gitlabService,
    projectFindingsStore,
    config.services.gitlabUrl
  ),
  updateProject: updateProject(gitlabService, projects, projectDetails),
}
