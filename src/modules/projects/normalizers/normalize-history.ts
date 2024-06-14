import { format } from 'date-fns'

import { GitLabEvent } from '@/api/gitlab/types/gitlab-event'

import { groupByMultiple } from '@/utils/array/group-by'

import { ProjectDetailsHistory } from '../types/project-details'

import { normalizeEvent } from './normalize-event'

export const normalizeHistory = (
  events: GitLabEvent[]
): ProjectDetailsHistory[] => {
  return Object.entries(
    groupByMultiple((x) => format(new Date(x.created_at), 'yyyy-MM-dd'), events)
  )
    .map(([date, events]) => ({
      date,
      dateDisplay: format(new Date(date), 'eeee, dd-MM-yyyy'),
      events: events
        .map(normalizeEvent)
        .sort((a, b) => b.date.getTime() - a.date.getTime()),
    }))
    .sort((a, b) => b.date.localeCompare(a.date))
}
