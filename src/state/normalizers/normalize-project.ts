import { GitLabProject } from '@/api/gitlab/types/gitlab-project'

import { Project } from '@/state/types/project'

export const normalizeProject = (raw: GitLabProject): Project => {
  return {
    name: raw.name,
    nameWithNamespace: raw.name_with_namespace,
    path: raw.path,
    pathWithNamespace: raw.path_with_namespace,
    createdAt: raw.created_at,
    defaultBranch: raw.default_branch,
    ssh: raw.ssh_url_to_repo,
    url: raw.web_url,
    readme: raw.readme_url,
    avatar: raw.avatar_url,
    lastActivityAt: raw.last_activity_at,
    isArchived: raw.archived,
    updatedAt: raw.updated_at,
    namespaceId: raw.namespace.id,
    namespace: raw.namespace.name,
    namespaceUrl: raw.namespace.web_url,
    tags: raw.tag_list.map((x) => x.toLowerCase()),
  }
}
