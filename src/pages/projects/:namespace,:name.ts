import { SignalWatcher } from '@lit-labs/preact-signals'
import { LitElement, html } from 'lit'
import { customElement, property } from 'lit/decorators.js'

import { updateTitle } from '@/modules/app/utils/update-title'

import { projectDetailsQuery } from '@/modules/projects/queries/project-details.query'
import { projectsQuery } from '@/modules/projects/queries/projects-query'

import '@/features/project-detail/project-detail'
import '@/features/project-detail/project-detail.skeleton'

@customElement('project-detail-page')
export class ProjectDetailPage extends SignalWatcher(LitElement) {
  @property({ type: String })
  private projectName = ''
  @property({ type: String })
  private projectNamespace = ''

  protected firstUpdated() {
    this.setTitle()
  }

  protected updated(changedProperties: Map<PropertyKey, unknown>): void {
    if (
      changedProperties.has('projectName') ||
      changedProperties.has('projectNamespace')
    ) {
      this.setTitle()
    }
  }

  private setTitle() {
    updateTitle(`${this.projectNamespace}/${this.projectName}`)
  }

  render() {
    if (!this.projectName || !this.projectNamespace) {
      return html`<not-found-page></not-found-page>`
    }

    const nameWithNamespace = `${this.projectNamespace}/${this.projectName}`

    const project = projectsQuery.data?.allByName[nameWithNamespace]

    if (!project) {
      return html`<not-found-page></not-found-page>`
    }

    const projectDetailsMap = projectDetailsQuery.data?.[project.id]

    const notFound =
      projectsQuery.status !== 'loading' &&
      !project &&
      projectDetailsQuery.status === 'loading' &&
      !projectDetailsMap?.isLoading &&
      !projectDetailsMap?.data

    if (notFound) {
      return html`<not-found-page></not-found-page>`
    }

    if (
      (!projectsQuery.data && projectsQuery.status === 'loading') ||
      (!projectDetailsMap?.data && projectDetailsQuery.status === 'loading')
    ) {
      return html`<project-detail-skeleton></project-detail-skeleton>`
    }

    return html`<project-detail
      .project=${project}
      .projectDetail=${projectDetailsMap?.data}
      .onClickReload=${() => projectDetailsQuery.fetch([project.id, 'network'])}
      .isLoading=${projectDetailsQuery.status === 'loading'}
    ></project-detail>`
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'project-detail-page': ProjectDetailPage
  }
}
