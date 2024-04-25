import { QUOTE_PROJECT_TAG, QUOTE_PROJECT_PREFIX } from '@/constants/projects'

import { Project } from '@/state/types/project'

export const isQuote = (project: Project): boolean => {
  return (
    project.tags.includes(QUOTE_PROJECT_TAG) ||
    project.name.startsWith(QUOTE_PROJECT_PREFIX)
  )
}
