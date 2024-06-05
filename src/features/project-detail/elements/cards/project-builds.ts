import { LitElement, html, css } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import { map } from 'lit/directives/map.js'

import { theme } from '@/theme/theme'

import { ProjectBuild } from '@/modules/projects/types/project-build'

import '@/features/project-detail/elements/build-item'

const ELEMENT_NAME = 'project-builds'

@customElement(ELEMENT_NAME)
export class ProjectBuilds extends LitElement {
  @property()
  private projectNamespace = ''
  @property()
  private projectName = ''
  @property()
  private projectId = 0
  @property()
  private builds: ProjectBuild[] = []

  static styles = [
    ...theme,
    css`
      sl-card::part(base) {
        display: flex;
        flex-direction: column;
        min-height: 300px;
        max-height: 500px;
        overflow: auto;
        resize: vertical;
      }

      sl-card::part(body) {
        display: flex;
        flex: 1;
        align-self: stretch;
        width: 100%;
      }

      section {
        display: flex;
        flex: 1;
        flex-direction: column;
      }
    `,
  ]

  render() {
    console.log({ name: this.projectName })

    return html`<sl-card>
      <section>
        ${map(
          this.builds,
          (build, index) =>
            html`<build-item
              .background=${index % 2 === 0 ? 'light' : 'dark'}
              .projectId=${this.projectId}
              .projectName=${this.projectName}
              .projectNamespace=${this.projectNamespace}
              .build=${build}
            ></build-item>`
        )}
      </section>
    </sl-card>`
  }
}

declare global {
  interface HTMLElementTagNameMap {
    [ELEMENT_NAME]: ProjectBuilds
  }
}
