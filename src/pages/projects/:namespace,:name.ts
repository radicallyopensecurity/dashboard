import { MobxLitElement } from '@adobe/lit-mobx'
import { html } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import { toJS } from 'mobx'

import { updateTitle } from '@/modules/app/utils/update-title'

import { projectsService } from '@/modules/projects/projects-service'
import { projectDetails } from '@/modules/projects/store/project-details-store'
import { projects } from '@/modules/projects/store/projects-store'

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
