import { gitlabClient } from '@/api/gitlab/gitlab-client'

import { createProject } from '@/modules/projects/services/create-project'
import { createVariable } from '@/modules/projects/services/create-variable'
import { syncNamespaces } from '@/modules/projects/services/sync-namespaces'
import { syncProjectDetails } from '@/modules/projects/services/sync-project-details'
import { syncProjectFinding } from '@/modules/projects/services/sync-project-finding'
import { syncProjects } from '@/modules/projects/services/sync-projects'
import { syncTemplates } from '@/modules/projects/services/sync-templates'
import { updateProject } from '@/modules/projects/services/update-project'
import { namespacesStore } from '@/modules/projects/store/namespaces-store'
import { projectDetails } from '@/modules/projects/store/project-details-store'
import { projectFindingsStore } from '@/modules/projects/store/project-findings-store'
import { projects } from '@/modules/projects/store/projects-store'
import { templatesStore } from '@/modules/projects/store/templates-store'

import { appSignal } from '../app/signals/app-signal'

export const projectsService = {
  createProject: createProject(gitlabClient, projects, appSignal),
  createVariable: createVariable(gitlabClient, projectDetails),
  syncNamespaces: syncNamespaces(gitlabClient, namespacesStore),
  syncProjects: syncProjects(gitlabClient, projects),
  syncProjectDetails: syncProjectDetails(gitlabClient, projectDetails),
  syncProjectFinding: syncProjectFinding(gitlabClient, projectFindingsStore),
  syncTemplates: syncTemplates(gitlabClient, templatesStore),
  updateProject: updateProject(gitlabClient, projects, projectDetails),
}
