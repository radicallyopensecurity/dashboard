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
  private projectName = ''
  @property({ type: String })
  private projectNamespace = ''

  render() {
    if (!this.projectName || !this.projectNamespace) {
      return html`<not-found-page></not-found-page>`
    }

    const nameWithNamespace = `${this.projectNamespace}/${this.projectName}`

    const project = toJS(this.projects.allByName)[nameWithNamespace] ?? null

    if (!project) {
      return html`<not-found-page></not-found-page>`
    }

    const projectDetailsMap = toJS(this.projectDetails.data)[project.id] ?? null

    const notFound =
      !this.projects.isLoading &&
      !project &&
      !projectDetailsMap?.isLoading &&
      !projectDetailsMap?.data

    if (notFound) {
      return html`<not-found-page></not-found-page>`
    }

    if (
      !projectDetailsMap.data &&
      (this.projects.isLoading ||
        projectDetailsMap.isLoading ||
        !projectDetailsMap)
    ) {
      return html`<project-detail-skeleton></project-detail-skeleton>`
    }

    return html`<project-detail
      .project=${project}
      .projectDetail=${projectDetailsMap.data}
      .onClickReload=${() =>
        projectsService.syncProjectDetails(project.id, 'network')}
      .isLoading=${projectDetailsMap.isLoading}
    ></project-detail>`
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'project-detail-page': ProjectDetailPage
  }
}
