import { format } from 'date-fns'

import { projectFile } from '@/api/gitlab/client/project-file'

import { createQuery } from '@/utils/signal/query/create-query'

import { groupProjects } from '../normalizers/normalize-project'
import { updateProjectFile } from '../services/update-project-file'
import { Project } from '../types/project'

import { projectsQuery } from './projects-query'

type UpdateDates = {
  projectId: number
  startDate?: Date | null
  endDate?: Date | null
}

export const updateDatesQuery = createQuery<Project, UpdateDates>(
  async ({ projectId, startDate, endDate }) => {
    const currentFile = await projectFile({
      id: projectId,
      path: 'source/offerte.xml',
      branch: 'main',
    })

    let text = atob(currentFile.content)

    if (startDate) {
      text = text.replace(
        /(<start>)(.*?)(<\/start>)/,
        `$1${format(startDate, 'yyyy-MM-dd')}$3`
      )
    }

    if (endDate) {
      text = text.replace(
        /(<end>)(.*?)(<\/end>)/,
        `$1${format(endDate, 'yyyy-MM-dd')}$3`
      )
    }

    return updateProjectFile({
      id: projectId,
      branch: 'main',
      path: 'source/offerte.xml',
      commitMessage: 'feat(offerte): update dates',
      content: text,
    })
  },
  {
    after: (val, project) => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-explicit-any
      const [thisProject] = val as any
      const { projectId } = thisProject as UpdateDates

      // optimistic update
      const all = projectsQuery.data?.all ?? []
      const filtered = all.filter((x) => x.id !== projectId)
      const newList = [...filtered, project]
      const grouped = groupProjects(newList)
      projectsQuery.set(grouped)
    },
  }
)
