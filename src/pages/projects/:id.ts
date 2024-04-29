import { MobxLitElement } from '@adobe/lit-mobx'
import { html } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import { toJS } from 'mobx'

import { projectDetails } from '@/modules/projects/project-details-store'
import { projectsService } from '@/modules/projects/projects-service'
import { projects } from '@/modules/projects/projects-store'

import '@/features/project-detail/project-detail'
import '@/features/project-detail/project-detail.skeleton'

@customElement('project-detail-page')
export class ProjectDetailPage extends MobxLitElement {
  private projects = projects
  private projectDetails = projectDetails

  @property({ type: String })
  private projectId = ''

  render() {
    if (!this.projectId) {
      return html`<not-found-page></not-found-page>`
    }

    const projectId = Number(this.projectId)

    const project = toJS(this.projects.allById)[projectId] ?? null
    const projectDetailsMap = toJS(this.projectDetails.data)[projectId] ?? null

    const notFound =
      !this.projects.isLoading &&
      !project &&
      !projectDetailsMap?.isLoading &&
      !projectDetailsMap?.data

    if (notFound) {
      return html`<not-found-page></not-found-page>`
    }

    if (
      this.projects.isLoading ||
      !projectDetailsMap ||
      projectDetailsMap.isLoading
    ) {
      return html`<project-detail-skeleton></project-detail-skeleton>`
    }

    return html`<project-detail
      .project=${project}
      .projectDetail=${projectDetailsMap.data}
      .onClickReload=${() =>
        projectsService.syncProjectDetails(projectId, 'network')}
    ></project-detail>`
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'project-detail-page': ProjectDetailPage
  }
}
