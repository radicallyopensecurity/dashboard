import { SignalWatcher } from '@lit-labs/preact-signals'
import { LitElement, html } from 'lit'
import { customElement, property } from 'lit/decorators.js'

import { updateTitle } from '@/modules/app/utils/update-title'

import { projectDetailsQuery } from '@/modules/projects/queries/project-details.query'
import { projectsQuery } from '@/modules/projects/queries/projects-query'
import {
  getQuotePdfUrl,
  getReportPdfUrl,
} from '@/modules/projects/utils/build-artifacts'

import { capitalize } from '@/utils/string/capitalize'

import '@/elements/pdf-preview/pdf-preview'

const ELEMENT_NAME = 'project-pdf-page'

@customElement(ELEMENT_NAME)
export class ProjectPdfPage extends SignalWatcher(LitElement) {
  @property()
  private projectName = ''
  @property()
  private projectNamespace = ''
  @property()
  private job: number | 'main' = 'main'
  @property()
  private type!: 'quote' | 'report'

  protected firstUpdated() {
    this.setTitle()
  }

  protected updated(changedProperties: Map<PropertyKey, unknown>): void {
    if (
      ['projectName', 'projectNamespace', 'job', 'type'].some((x) =>
        changedProperties.has(x)
      )
    ) {
      this.setTitle()
    }
  }

  private setTitle() {
    updateTitle(
      `${capitalize(this.type)} PDF ${this.projectNamespace}/${this.projectName}`
    )
  }

  render() {
    if (!this.projectName || !this.projectNamespace || !this.type) {
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
      return html``
    }

    let url = ''
    if (this.job === 'main') {
      url = this.type === 'quote' ? project.quotePdf : project.reportPdf
    } else {
      const fn = this.type === 'quote' ? getQuotePdfUrl : getReportPdfUrl
      url = fn(project.id, this.job, project.name)
    }

    const password = projectDetailsMap?.data?.pdfPassword

    return html`<pdf-preview .url=${url} .password=${password}></pdf-preview>`
  }
}

declare global {
  interface HTMLElementTagNameMap {
    [ELEMENT_NAME]: ProjectPdfPage
  }
}
