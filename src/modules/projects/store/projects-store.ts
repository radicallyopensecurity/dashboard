import { action, makeAutoObservable, observable } from 'mobx'

import { Project } from '@/modules/projects/types/project'

import { groupBy } from '@/utils/array/group-by'
import { uniqueBy } from '@/utils/array/unique-by'
import { createLogger } from '@/utils/logging/create-logger'

const logger = createLogger('projects-store')

export class ProjectsStore {
  @observable
  public quotes: Project[] = []
  @observable
  public pentests: Project[] = []
  @observable
  public all: Project[] = []
  @observable
  public allById: Record<number, Project | undefined> = {}
  @observable
  public allByName: Record<string, Project | undefined> = {}

  @observable
  public isLoading = true

  constructor() {
    makeAutoObservable(this)
  }

  @action
  public setIsLoading(value: boolean) {
    this.isLoading = value
  }

  storeProjects(projects: Project[]) {
    const quotes = projects.filter((x) => x.isQuote)
    const pentests = projects.filter((x) => x.isPentest)
    const all = uniqueBy((x) => x.id, quotes.concat(pentests))
    const allById = groupBy((x) => x.id, all)
    const allByName = groupBy((x) => x.pathWithNamespace, all)

    logger.debug('filtered result', {
      quotes,
      pentests,
      all,
      allById,
      allByName,
    })

    this.quotes = quotes
    this.pentests = pentests
    this.all = all
    this.allById = allById
    this.allByName = allByName
  }

  @action
  update(project: Project) {
    const filtered = this.all.filter((x) => x.id !== project.id)
    const newList = [...filtered, project]
    this.storeProjects(newList)
  }

  @action
  public set(projects: Project[]) {
    this.storeProjects(projects)
  }
}

export const projects = new ProjectsStore()

export type ProjectsStoreType = typeof projects