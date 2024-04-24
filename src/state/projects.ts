import { action, makeAutoObservable, observable } from 'mobx'

import { createLogger } from '@/utils/logging/create-logger'

import { GitLabProject } from '@/api/gitlab/types/gitlab-project'

import { normalizeProject } from '@/state/normalizers/normalize-project'
import { Project } from '@/state/types/project'
import { isPentest } from '@/state/utils/is-pentest'
import { isQuote } from '@/state/utils/is-quote'

const logger = createLogger('projects-state')

class ProjectsState {
  @observable
  public quotes: Project[] = []
  @observable
  public pentests: Project[] = []
  @observable
  public all: Project[] = []

  constructor() {
    makeAutoObservable(this)
  }

  @action
  public setFromGitlabProjects(gitlabProjects: GitLabProject[]) {
    logger.info('normalizing gitlab projects')
    const normalized = gitlabProjects.map(normalizeProject)
    logger.debug('normalized result', normalized)

    logger.info('filtering normalized projects')
    const quotes = normalized.filter(isQuote)
    const pentests = normalized.filter(isPentest)
    const all = quotes.concat(pentests)

    logger.debug('filtered result', {
      quotes,
      pentests,
      all,
    })

    this.quotes = quotes
    this.pentests = pentests
    this.all = all
  }
}

export const projects = new ProjectsState()
