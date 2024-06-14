import { LitElement, html, css } from 'lit'
import { customElement, property } from 'lit/decorators.js'

import { theme } from '@/theme/theme'

import { Project } from '@/modules/projects/types/project'

const ELEMENT_NAME = 'projects-overview'

@customElement(ELEMENT_NAME)
export class ProjectsOverview extends LitElement {
  @property()
  projects: Project[] = []

  protected updated(_changedProperties: Map<PropertyKey, unknown>): void {
    console.log(_changedProperties)
  }

  static styles = [
    ...theme,
    css`
      :host {
        text-align: center;
      }
    `,
  ]

  render() {
    console.log(this.projects)
    return html``
  }
}

declare global {
  interface HTMLElementTagNameMap {
    [ELEMENT_NAME]: ProjectsOverview
  }
}
