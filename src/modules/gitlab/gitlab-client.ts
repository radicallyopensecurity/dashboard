import { allProjects } from '@/modules/gitlab/functions/all-projects'
import { projects } from '@/modules/gitlab/functions/projects'
import { user } from '@/modules/gitlab/functions/user'

export const gitlabClient = {
  user,
  projects,
  allProjects,
}

export type GitlabClient = typeof gitlabClient
