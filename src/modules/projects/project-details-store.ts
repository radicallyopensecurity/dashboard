import { action, makeAutoObservable, observable } from 'mobx'

import { ProjectDetails } from '@/modules/projects/types/project-details'

export type ProjectDetailsMap = {
  isLoading: boolean
  error: string | null
  data: ProjectDetails | null
}

export class ProjectDetailsStore {
  @observable
  public byId: Record<number, ProjectDetailsMap> = {}

  constructor() {
    makeAutoObservable(this)
  }

  @action
  public setIsLoading(id: number, value: boolean) {
    if (!this.byId[id]) {
      this.byId = {
        ...this.byId,
        [id]: {
          isLoading: value,
          error: null,
          data: null,
        },
      }
      return
    }

    this.byId = {
      ...this.byId,
      [id]: {
        ...this.byId[id],
        isLoading: value,
        error: null,
      },
    }
  }

  @action
  public set(project: ProjectDetails) {
    this.byId = {
      ...this.byId,
      [project.id]: {
        ...this.byId[project.id],
        data: project,
      },
    }
  }
}

export const projectDetails = new ProjectDetailsStore()
