import { GitLabMember } from '@/modules/gitlab/types/gitlab-member'

import { ProjectDetailsMember } from '@/modules/projects/types/project-details'

export const normalizeMember = (raw: GitLabMember): ProjectDetailsMember => ({
  name: raw.name,
  avatar: raw.avatar_url,
  url: raw.web_url,
})
