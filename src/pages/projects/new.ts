import { LitElement, html } from 'lit'
import { customElement } from 'lit/decorators.js'

@customElement('project-new-page')
export class ProjectNewPage extends LitElement {
  render() {
    return html` <h1>New Project</h1>`
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'project-new-page': ProjectNewPage
  }
}
