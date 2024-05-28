import { Project } from '@/modules/projects/types/project'

export const filterProjects = (projects: Project[], search: string) => {
  if (!search) {
    return projects
  }

  const result = projects.filter((p) => {
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

  return result
}
