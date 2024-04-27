import { gitlabClient } from '@/modules/gitlab/client/gitlab-client'
import { fetchPaginated } from '@/modules/gitlab/utils/fetch-paginated'

export const gitlabService = {
  events: (id: number) =>
    fetchPaginated(({ perPage, page }) =>
      gitlabClient.events({ perPage, page, id })
    ),
  issues: (id: number) =>
    fetchPaginated(({ perPage, page }) =>
      gitlabClient.issues({ perPage, page, id })
    ),
  labels: (id: number) =>
    fetchPaginated(({ perPage, page }) =>
      gitlabClient.labels({ perPage, page, id })
    ),
  members: (id: number) =>
    fetchPaginated(({ perPage, page }) =>
      gitlabClient.members({ perPage, page, id })
    ),
  projects: () => fetchPaginated(gitlabClient.projects),
  user: gitlabClient.user,
  variables: (id: number) =>
    fetchPaginated(({ perPage, page }) =>
      gitlabClient.variables({ perPage, page, id })
    ),
}

export type GitLabService = typeof gitlabService
