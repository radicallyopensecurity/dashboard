import { LitElement, PropertyValueMap, html } from 'lit'
import { customElement, property } from 'lit/decorators.js'

@customElement('project-detail-page')
export class ProjectNewPage extends LitElement {
  @property({ type: String })
  projectId = ''

  protected firstUpdated(
    _changedProperties: PropertyValueMap<any> | Map<PropertyKey, unknown>
  ): void {
    console.log(_changedProperties)
  }

  protected willUpdate(
    _changedProperties: PropertyValueMap<any> | Map<PropertyKey, unknown>
  ): void {
    console.log(_changedProperties)
  }

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
