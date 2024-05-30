import { action, makeAutoObservable, observable } from 'mobx'

import { ProjectDetails } from '@/modules/projects/types/project-details'

export type ProjectDetailsMap = {
  isLoading: boolean
  error: string | null
  data: ProjectDetails | null
}

export class ProjectDetailsStore {
  @observable
  public data: Record<number, ProjectDetailsMap> = {}

  constructor() {
    makeAutoObservable(this)
  }

  @action
  public setIsLoading(id: number, value: boolean) {
    if (!this.data[id]) {
      this.data = {
        ...this.data,
        [id]: {
          isLoading: value,
          error: null,
          data: null,
        },
      }
      return
    }

    this.data = {
      ...this.data,
      [id]: {
        ...this.data[id],
        isLoading: value,
        error: null,
      },
    }
  }

  @action
  public set(project: ProjectDetails) {
    this.data = {
      ...this.data,
      [project.id]: {
        ...this.data[project.id],
        data: project,
      },
    }
  }
}

export const projectDetails = new ProjectDetailsStore()
