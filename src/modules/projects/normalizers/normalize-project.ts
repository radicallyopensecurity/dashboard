import { config } from '@/config'

import { GitLabProject } from '@/api/gitlab/types/gitlab-project'
import { GitLabProjectFile } from '@/api/gitlab/types/gitlab-project-file'

import { Project } from '@/modules/projects/types/project'

import { isPentest } from '@/modules/projects/utils/is-pentest'
import { isQuote } from '@/modules/projects/utils/is-quote'

import { groupBy } from '@/utils/array/group-by'
import { uniqueBy } from '@/utils/array/unique-by'
import { getChannelUrl } from '@/utils/rocket-chat/get-channel-url'

import { normalizePdf } from './normalize-pdf'

export const normalizeProject = (
  raw: GitLabProject,
  quote: GitLabProjectFile | null
): Project => {
  const tags = raw.tag_list.map((x) => x.toLowerCase())
  const chatUrl = getChannelUrl(config.services.rocketChatUrl, raw.name)

  let startDate: Date | null = null
  let endDate: Date | null = null

  if (quote) {
    const text = atob(quote.content)
    const xml = new window.DOMParser().parseFromString(text, 'text/xml')
    const planning = xml.getElementsByTagName('planning')[0]
    const start = planning.getElementsByTagName('start')[0].textContent
    const end = planning.getElementsByTagName('end')[0].textContent

    if (start) {
      startDate = new Date(start)
    }

    if (end) {
      endDate = new Date(end)
    }
  }

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
    startDate,
    endDate,
  }
}

export type ProjectsData = {
  quotes: Project[]
  pentests: Project[]
  all: Project[]
  allById: Record<number, Project | undefined>
  allByName: Record<string, Project | undefined>
}

export const groupProjects = (result: Project[]): ProjectsData => {
  const quotes = result.filter((x) => x.isQuote)
  const pentests = result.filter((x) => x.isPentest)
  const all = uniqueBy((x) => x.id, quotes.concat(pentests))
  const allById = groupBy((x) => x.id, all)
  const allByName = groupBy((x) => x.pathWithNamespace, all)

  return {
    quotes,
    pentests,
    all,
    allById,
    allByName,
  }
}
