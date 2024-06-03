import { config } from '@/config'

import { GitLabProject } from '@/api/gitlab/types/gitlab-project'

import { Project } from '@/modules/projects/types/project'

import { isPentest } from '@/modules/projects/utils/is-pentest'
import { isQuote } from '@/modules/projects/utils/is-quote'

import { getChannelUrl } from '@/utils/rocket-chat/get-channel-url'

import { normalizePdf } from './normalize-pdf'

export const normalizeProject = (raw: GitLabProject): Project => {
  const tags = raw.tag_list.map((x) => x.toLowerCase())
  const chatUrl = getChannelUrl(config.services.rocketChatUrl, raw.name)

  return {
    id: raw.id,
    name: raw.name,
    nameWithNamespace: raw.name_with_namespace,
    path: raw.path,
    pathWithNamespace: raw.path_with_namespace,
    createdAt: new Date(raw.created_at),
    defaultBranch: raw.default_branch,
    ssh: raw.ssh_url_to_repo,
    url: raw.web_url,
    readme: raw.readme_url,
    avatar: raw.avatar_url,
    lastActivityAt: new Date(raw.last_activity_at),
    isArchived: raw.archived,
    updatedAt: new Date(raw.updated_at),
    namespace: {
      id: raw.namespace.id,
      name: raw.namespace.name,
      path: raw.namespace.path,
      url: raw.namespace.web_url,
      avatar: raw.namespace.avatar_url,
    },
    tags,
    isQuote: isQuote(tags, raw.name),
    isPentest: isPentest(tags, raw.name),
    quotePdf: normalizePdf(raw, 'quote'),
    reportPdf: normalizePdf(raw, 'report'),
    chatUrl,
    topics: raw.topics,
  }
}
