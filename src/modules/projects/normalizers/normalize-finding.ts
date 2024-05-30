import type { GitLabIssue } from '@/api/gitlab/types/gitlab-issue'

import type { ProjectDetailsFinding } from '@/modules/projects/types/project-details'

import { normalizeFindingLabel } from '@/modules/projects/normalizers/normalize-finding-label'


export const normalizeFinding = (raw: GitLabIssue): ProjectDetailsFinding => {
  return {
    id: raw.id,
    iid: raw.iid,
    title: raw.title,
    label: normalizeFindingLabel(raw.labels),
    updatedAt: new Date(raw.updated_at),
    url: raw.web_url,
    description: raw.description,
  }
}
