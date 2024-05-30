import { LitElement, html, css } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import { map } from 'lit/directives/map.js'

import { theme } from '@/theme/theme'

import { ProjectDetailsFinding } from '@/modules/projects/types/project-details'

import '@/features/project-detail/elements/finding-details-item'

const ELEMENT_NAME = 'finding-details'

@customElement(ELEMENT_NAME)
export class FindingDetails extends LitElement {
  @property()
  private findings: ProjectDetailsFinding[] = []
  @property()
  private projectId = 0

  static styles = [
    ...theme,
    css`
      :host {
        display: flex;
        flex-direction: column;
      }
    `,
  ]

  render() {
    const { findings, projectId } = this

    return map(
      findings,
      (finding) =>
        html`<finding-details-item
          .finding=${finding}
          .projectId=${projectId}
        ></finding-details-item>`
    )
  }
}

declare global {
  interface HTMLElementTagNameMap {
    [ELEMENT_NAME]: FindingDetails
  }
}
