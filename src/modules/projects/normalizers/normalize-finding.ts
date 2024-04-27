import { GitLabIssue } from '@/modules/gitlab/types/gitlab-issue'

import { ProjectDetailsFinding } from '@/modules/projects/types/project-details'

export const normalizeFinding = (raw: GitLabIssue): ProjectDetailsFinding => {
  return {
    id: raw.id,
    iid: raw.iid,
    title: raw.title,
    labels: raw.labels,
    updatedAt: new Date(raw.updated_at),
    severity: 1,
  }
}
