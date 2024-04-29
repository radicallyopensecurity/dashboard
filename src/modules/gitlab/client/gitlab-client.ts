import { discussions } from '@/modules/gitlab/client/functions/discussions'
import { events } from '@/modules/gitlab/client/functions/events'
import { issues } from '@/modules/gitlab/client/functions/issues'
import { labels } from '@/modules/gitlab/client/functions/labels'
import { members } from '@/modules/gitlab/client/functions/members'
import { projects } from '@/modules/gitlab/client/functions/projects'
import { user } from '@/modules/gitlab/client/functions/user'
import { variables } from '@/modules/gitlab/client/functions/variables'

export const gitlabClient = {
  discussions,
  events,
  issues,
  labels,
  members,
  projects,
  user,
  variables,
}

export type GitlabClient = typeof gitlabClient
