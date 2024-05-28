import { ProjectDetailsMember } from '@/modules/projects/types/project-details'

import { GitLabMember } from '@/api/gitlab/types/gitlab-member'

export const normalizeMember = (raw: GitLabMember): ProjectDetailsMember => ({
  name: raw.name,
  avatar: raw.avatar_url,
  url: raw.web_url,
})
