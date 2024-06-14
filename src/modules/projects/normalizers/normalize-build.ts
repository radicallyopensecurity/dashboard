import { GitLabJob } from '@/api/gitlab/types/gitlab-job'

import { ProjectBuild } from '../types/project-build'

export const normalizeBuild = (raw: GitLabJob): ProjectBuild => {
  return {
    id: raw.id,
    url: raw.web_url,
    status: raw.status,
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-explicit-any
    files: raw.artifacts as any,
    createdAt: new Date(raw.created_at),
    finishedAt: new Date(raw.finished_at),
    user: {
      avatar: raw.user.avatar_url,
      url: raw.user.web_url,
      username: raw.user.name,
    },
  }
}
