import { action, makeAutoObservable, observable } from 'mobx'

import { GitLabProject } from '@/api/gitlab/types/gitlab-project'

import { normalizeProject } from '@/state/normalizers/normalize-project'
import { Project } from '@/state/types/project'

import { groupBy } from '@/utils/array/group-by'
import { uniqueBy } from '@/utils/array/unique-by'
import { createLogger } from '@/utils/logging/create-logger'

const logger = createLogger('projects-state')

class ProjectsState {
  @observable
  public quotes: Project[] = []
  @observable
  public pentests: Project[] = []
  @observable
  public all: Project[] = []
  @observable
  public allById: Record<number, Project> = {}

  @observable
  public isLoading = true

  constructor() {
    makeAutoObservable(this)
  }

  @action
  public setIsLoading(value: boolean) {
    this.isLoading = value
  }

  @action
  public fromAllProjects(gitlabProjects: GitLabProject[]) {
    logger.info('normalizing gitlab projects')
    const normalized = gitlabProjects.map(normalizeProject)
    logger.debug('normalized result', normalized)

    logger.info('filtering normalized projects')
    const quotes = normalized.filter((x) => x.isQuote)
    const pentests = normalized.filter((x) => x.isPentest)
    const all = uniqueBy((x) => x.id, quotes.concat(pentests))
    const allById = groupBy((x) => x.id, all)

    logger.debug('filtered result', {
      quotes,
      pentests,
      all,
      allById,
    })

    this.quotes = quotes
    this.pentests = pentests
    this.all = all
    this.allById = allById
  }
}

export const projects = new ProjectsState()
