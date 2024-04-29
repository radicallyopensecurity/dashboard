import { action, makeAutoObservable, observable } from 'mobx'

import { ProjectFindingDetails } from './types/project-findings'
import { projectFindingKey } from './utils/project-finding-key'

export type ProjectDiscussionsMap = {
  isLoading: boolean
  error: string | null
  data: ProjectFindingDetails | null
}

export class ProjectFindingsStore {
  @observable
  public data: Record<string, ProjectDiscussionsMap> = {}

  constructor() {
    makeAutoObservable(this)
  }

  @action
  public setIsLoading(projectId: number, issueId: number, value: boolean) {
    const key = projectFindingKey(projectId, issueId)

    if (!this.data[key]) {
      this.data = {
        ...this.data,
        [key]: {
          isLoading: value,
          error: null,
          data: null,
        },
      }
      return
    }

    this.data = {
      ...this.data,
      [key]: {
        ...this.data[key],
        isLoading: value,
        error: null,
      },
    }
  }

  @action
  public set(finding: ProjectFindingDetails) {
    const { projectId, issueId } = finding
    const key = projectFindingKey(projectId, issueId)
    console.log('key', key)
    this.data = {
      ...this.data,
      [key]: {
        ...this.data[key],
        data: finding,
      },
    }
  }
}

export const projectFindingsStore = new ProjectFindingsStore()

export type ProjectsFindingsStoreType = typeof projectFindingsStore
