import { MobxLitElement } from '@adobe/lit-mobx'
import { type SlDetails } from '@shoelace-style/shoelace'
import { css, html } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import { createRef, ref, type Ref } from 'lit/directives/ref.js'
import { marked } from 'marked'
import { toJS } from 'mobx'

import { theme } from '@/theme/theme'

import { ProjectDetailsFinding } from '@/modules/projects/types/project-details'

import { projectFindingsStore } from '@/modules/projects/project-findings-store'
import { projectsService } from '@/modules/projects/projects-service'
import { projectFindingKey } from '@/modules/projects/utils/project-finding-key'

import { createLogger } from '@/utils/logging/create-logger'

const ELEMENT_NAME = 'finding-details-item'

const logger = createLogger(ELEMENT_NAME)

@customElement(ELEMENT_NAME)
export class FindingDetailsItem extends MobxLitElement {
  private projectFindingsStore = projectFindingsStore

  @property()
  private finding!: ProjectDetailsFinding
  @property()
  private projectId = 0

  private fetched = false

  private detailsRef: Ref<SlDetails> = createRef()

  static styles = [
    ...theme,
    css`
      sl-details::part(content) {
        display: flex;
        flex-direction: column;
        gap: var(--sl-spacing-large);
      }

      h3 {
        margin: 0;
      }
    `,
  ]

  protected async firstUpdated() {
    const value = this.detailsRef.value

    await value?.updateComplete

    if (!value) {
      logger.debug(
        `Could not register finding details element for findings`,
        this.finding,
        this.projectId
      )
      return
    }

    value.addEventListener('sl-show', () => {
      if (!this.fetched) {
        void projectsService.syncProjectFinding(
          this.projectId,
          this.finding.iid
        )
        this.fetched = true
      }
    })
  }

  render() {
    const {
      projectId,
      finding: { iid, title, description },
      projectFindingsStore,
    } = this

    const details = toJS(projectFindingsStore.data)[
      projectFindingKey(projectId, iid)
    ]

    let content = html`error`
    if (details?.isLoading) {
      content = html`loading...`
    } else if (!details?.isLoading && details?.data) {
      const descriptionMarkdown = marked(description, { gfm: true }) as string

      const technicalDescriptionMarkdown = marked(
        details.data.technicalDescription,
        { gfm: true }
      ) as string

      const impactMarkdown = marked(details.data.impact, {
        gfm: true,
      }) as string

      const recommendationMarkdown = marked(details.data.recommendation, {
        gfm: true,
      }) as string

      const htmlContent = `
        <section>
          ${descriptionMarkdown}
        </section>

        </section>
        <h3>Technical Description</h3>
          ${technicalDescriptionMarkdown}
        </section>

        </section>
          <h3>Impact</h3>
          ${impactMarkdown}
        </section>

        </section>
          <h3>Recommendation</h3>
          ${recommendationMarkdown}
        </section>
      `

      const iframed = html`<secure-iframe
        .UNSAFE_html=${htmlContent}
      ></secure-iframe>`

      content = iframed
    }

    return html`<sl-details ${ref(this.detailsRef)} iid=${iid} summary=${title}>
      ${content}
    </sl-details>`
  }
}

declare global {
  interface HTMLElementTagNameMap {
    [ELEMENT_NAME]: FindingDetailsItem
  }
}
