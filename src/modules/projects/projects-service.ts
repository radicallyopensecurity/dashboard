import { gitlabClient } from '@/modules/gitlab/gitlab-client'
import { projects } from '@/modules/projects/projects-store'
import { syncProjects } from '@/modules/projects/services/sync-projects'

export const projectsService = {
  syncProjects: syncProjects(gitlabClient, projects),
}
