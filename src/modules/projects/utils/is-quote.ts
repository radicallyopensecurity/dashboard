import { QUOTE_PROJECT_TAG, QUOTE_PROJECT_PREFIX } from '@/constants/projects'

import { type Project } from '@/modules/projects/types/project'

export function isQuote(project: Project): boolean
export function isQuote(tags: string[], name: string): boolean
export function isQuote(
  projectOrTags: Project | string[],
  name?: string
): boolean {
  let _tags: string[] = []
  let _name = name ?? ''

  if (!Array.isArray(projectOrTags)) {
    _tags = projectOrTags.tags
    _name = projectOrTags.name
  } else {
    _tags = projectOrTags
  }

  return (
    _tags.includes(QUOTE_PROJECT_TAG) || _name.startsWith(QUOTE_PROJECT_PREFIX)
  )
}
