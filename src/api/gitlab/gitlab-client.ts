import { allProjects } from '@/api/gitlab/functions/all-projects'
import { projects } from '@/api/gitlab/functions/projects'
import { user } from '@/api/gitlab/functions/user'

export const gitlabClient = {
  user,
  projects,
  allProjects,
}
