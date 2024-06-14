import { Project } from '@/modules/projects/types/project'

import { ProjectWithChannelNames } from '@/modules/projects/utils/add-channel-names'

export type TypeFilter = 'all' | 'quote' | 'pentest'
export type SortOption = 'name' | 'gitlabActivity' | 'chatActivity'
export type SortDirection = 'asc' | 'dsc'

const getTime = (
  project: ProjectWithChannelNames,
  fn: typeof Math.min | typeof Math.max
): number => {
  const latestDate = fn(
    project.pentestChannel?.lastUpdatedAt.getTime() ?? 0,
    project.quoteChannel?.lastUpdatedAt.getTime() ?? 0
  )

  return latestDate
}

export const sortProjects = (
  projects: ProjectWithChannelNames[],
  option: SortOption,
  direction: SortDirection
): ProjectWithChannelNames[] => {
  let result = projects

  switch (option) {
    case 'name':
      result = result.sort((a, b) =>
        a.project.name.localeCompare(b.project.name)
      )
      break

    case 'gitlabActivity':
      result = result.sort(
        (a, b) =>
          a.project.lastActivityAt.getTime() -
          b.project.lastActivityAt.getTime()
      )
      break

    case 'chatActivity':
      {
        const mathFn = direction === 'dsc' ? Math.max : Math.min
        result = result.sort((a, b) => getTime(a, mathFn) - getTime(b, mathFn))
      }

      break

    default:
      break
  }

  return direction === 'dsc' ? result.reverse() : result
}

export const filterProjects = (
  projects: Project[],
  search: string,
  type: TypeFilter
) => {
  let result = projects

  result = result.filter((project) => {
    if (type === 'pentest') {
      return project.isPentest
    } else if (type === 'quote') {
      return project.isQuote
    }

    return project
  })

  if (search) {
    result = projects.filter((p) => {
      if (
        p.name
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '')
          .toLocaleLowerCase()
          .includes(search)
      ) {
        return true
      }

      if (
        p.namespace.name
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '')
          .toLocaleLowerCase()
          .includes(search)
      ) {
        return true
      }

      return false
    })
  }

  return result
}
