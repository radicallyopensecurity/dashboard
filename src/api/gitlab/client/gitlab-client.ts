import { createVariable } from './functions/create-variable'
import { updateProject } from './functions/update-project'

import { discussions } from '@/api/gitlab/client/functions/discussions'
import { events } from '@/api/gitlab/client/functions/events'
import { issues } from '@/api/gitlab/client/functions/issues'
import { labels } from '@/api/gitlab/client/functions/labels'
import { members } from '@/api/gitlab/client/functions/members'
import { projects } from '@/api/gitlab/client/functions/projects'
import { user } from '@/api/gitlab/client/functions/user'
import { variables } from '@/api/gitlab/client/functions/variables'

export const gitlabClient = {
  discussions,
  events,
  issues,
  labels,
  members,
  projects,
  user,
  variables,
  updateProject,
  createVariable,
}

export type GitlabClient = typeof gitlabClient
