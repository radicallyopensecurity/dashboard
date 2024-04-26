import { MobxLitElement } from '@adobe/lit-mobx'
import { html } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import { toJS } from 'mobx'

import { projects } from '@/modules/projects/projects-store'

import '@/features/project-detail/project-detail'

@customElement('project-detail-page')
export class ProjectNewPage extends MobxLitElement {
  private projects = projects

  @property({ type: String })
  projectId = ''

  render() {
    if (!this.projectId) {
      return html`<not-found-page></not-found-page>`
    }

    const { allById, isLoading } = this.projects
    const project = toJS(allById)[Number(this.projectId)] ?? {}

    if (!project?.id && !isLoading) {
      return html`<not-found-page></not-found-page>`
    }

    return html`<project-detail
      .project=${project}
      .isLoading=${isLoading}
    ></project-detail>`
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'project-detail-page': ProjectNewPage
  }
}
