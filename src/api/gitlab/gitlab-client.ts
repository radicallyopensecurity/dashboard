import { createAccessToken } from '@/api/gitlab/client/create-access-token'
import { createProject } from '@/api/gitlab/client/create-project'
import { createVariable } from '@/api/gitlab/client/create-variable'
import { discussions } from '@/api/gitlab/client/discussions'
import { events } from '@/api/gitlab/client/events'
import { group } from '@/api/gitlab/client/group'
import { groupProjects } from '@/api/gitlab/client/group-projects'
import { groups } from '@/api/gitlab/client/groups'
import { issues } from '@/api/gitlab/client/issues'
import { jobs } from '@/api/gitlab/client/jobs'
import { labels } from '@/api/gitlab/client/labels'
import { members } from '@/api/gitlab/client/members'
import { projects } from '@/api/gitlab/client/projects'
import { updateProject } from '@/api/gitlab/client/update-project'
import { user } from '@/api/gitlab/client/user'
import { variables } from '@/api/gitlab/client/variables'

export const gitlabClient = {
  createAccessToken,
  createProject,
  createVariable,
  discussions,
  events,
  group,
  groups,
  groupProjects,
  issues,
  jobs,
  labels,
  members,
  projects,
  updateProject,
  user,
  variables,
}

export type GitLabClient = typeof gitlabClient
