import { gitlabClient } from '@/modules/gitlab/client/gitlab-client'
import { fetchPaginated } from '@/modules/gitlab/utils/fetch-paginated'

export const gitlabService = {
  discussions: (projectId: number, issueId: number) =>
    fetchPaginated(({ perPage, page }) =>
      gitlabClient.discussions({ perPage, page, projectId, issueId })
    ),

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

  variables: (id: number) =>
    fetchPaginated(({ perPage, page }) =>
      gitlabClient.variables({ perPage, page, id })
    ),

  user: gitlabClient.user,
  updateProject: gitlabClient.updateProject,
  createVariable: gitlabClient.createVariable,
}

export type GitLabService = typeof gitlabService
