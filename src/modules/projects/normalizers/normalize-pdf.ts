import { config } from '@/config'

import { GitLabProject } from '@/modules/gitlab/types/gitlab-project'

const PDF_TYPE_MAP = {
  quote: 'offerte',
  report: 'report',
}

export const normalizePdf = (raw: GitLabProject, type: 'quote' | 'report') => {
  let title = raw.path
  if (raw.name.startsWith('pen-') || raw.name.startsWith('off-')) {
    title = raw.name.slice(4)
  }

  const prefix = PDF_TYPE_MAP[type]

  const url = `${config.services.gitlabUrl}/api/v4/projects/${raw.id}/jobs/artifacts/main/raw/target/${prefix}_${title}.pdf?job=build`

  return url
}
