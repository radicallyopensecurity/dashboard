import { Template } from '../types/template'

import { GitLabProject } from '@/api/gitlab/types/gitlab-project'

export const normalizeTemplate = (project: GitLabProject): Template => {
  return {
    name: project.name,
    tagList: project.tag_list,
    url: project.http_url_to_repo,
  }
}
