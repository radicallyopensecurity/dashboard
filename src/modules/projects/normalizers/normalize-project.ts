import { config } from '@/config'

import { getChannelName } from '@/utils/rocket-chat/get-channel-name'
import { getChannelUrl } from '@/utils/rocket-chat/get-channel-url'

import { GitLabProject } from '@/modules/gitlab/types/gitlab-project'
import { Project } from '@/modules/projects/types/project'
import { isPentest } from '@/modules/projects/utils/is-pentest'
import { isQuote } from '@/modules/projects/utils/is-quote'


export const normalizeProject = (raw: GitLabProject): Project => {
  const tags = raw.tag_list.map((x) => x.toLowerCase())
  const channelName = getChannelName(
    raw.namespace.path,
    raw.name_with_namespace
  )
  const chatUrl =
    (channelName &&
      getChannelUrl(config.services.rocketChatUrl, channelName)) ??
    null

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
    chatUrl,
  }
}
