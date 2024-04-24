import { Project } from '@/state/types/project'

import { QUOTE_PROJECT_TAG, QUOTE_PROJECT_PREFIX } from '@/constants'

export const isQuote = (project: Project): boolean => {
  return (
    project.tags.includes(QUOTE_PROJECT_TAG) ||
    project.name.startsWith(QUOTE_PROJECT_PREFIX)
  )
}
