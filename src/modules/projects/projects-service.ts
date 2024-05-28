import { config } from '@/config'

import { namespacesStore } from '@/modules/projects/namespaces-store'
import { projectDetails } from '@/modules/projects/project-details-store'
import { projectFindingsStore } from '@/modules/projects/project-findings-store'
import { projects } from '@/modules/projects/projects-store'
import { createVariable } from '@/modules/projects/services/create-variable'
import { syncNamespaces } from '@/modules/projects/services/sync-namespaces'
import { syncProjectDetails } from '@/modules/projects/services/sync-project-details'
import { syncProjectFinding } from '@/modules/projects/services/sync-project-finding'
import { syncProjects } from '@/modules/projects/services/sync-projects'
import { updateProject } from '@/modules/projects/services/update-project'

import { appStore } from '../app/app-store'

import { createProject } from './services/create-project'
import { syncTemplates } from './services/sync-templates'
import { templatesStore } from './templates-store'

import { gitlabService } from '@/api/gitlab/gitlab-service'

export const projectsService = {
  syncProjects: syncProjects(gitlabService, projects),
  syncProjectDetails: syncProjectDetails(gitlabService, projectDetails),
  syncProjectFinding: syncProjectFinding(
    gitlabService,
    projectFindingsStore,
    config.services.gitlabUrl
  ),
  updateProject: updateProject(gitlabService, projects, projectDetails),
  createVariable: createVariable(gitlabService, projectDetails),
  syncNamespaces: syncNamespaces(gitlabService, namespacesStore),
  syncTemplates: syncTemplates(gitlabService, templatesStore),
  createProject: createProject(gitlabService, projects, appStore),
}
