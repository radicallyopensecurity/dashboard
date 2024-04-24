import { LitElement, html } from 'lit'
import { customElement, property } from 'lit/decorators.js'

import { theme } from '@/theme/theme'

@customElement('project-detail-page')
export class ProjectNewPage extends LitElement {
  static styles = [...theme]

  @property({ type: String })
  projectId = ''

  render() {
    if (!this.projectId) {
      return html`<not-found-page></not-found-page>`
    }

    return html`<h1>Project Detail ${this.projectId}</h1>`
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'project-detail-page': ProjectNewPage
  }
}
