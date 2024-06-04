import { groupBy } from '@/utils/array/group-by'
import { uniqueBy } from '@/utils/array/unique-by'
import { createQuery } from '@/utils/signal/query/create-query'

import { projects } from '../services/sync-projects'
import { Project } from '../types/project'

type ProjectsQueryData = {
  quotes: Project[]
  pentests: Project[]
  all: Project[]
  allById: Record<number, Project | undefined>
  allByName: Record<string, Project | undefined>
}

export const groupProjects = (result: Project[]): ProjectsQueryData => {
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

export const projectsQuery = createQuery<
  ProjectsQueryData,
  undefined,
  Project[]
>(projects, {
  transform: (result) => groupProjects(result),
})
