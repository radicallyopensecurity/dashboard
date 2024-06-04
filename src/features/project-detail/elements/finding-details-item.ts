import { SignalWatcher } from '@lit-labs/preact-signals'
import { type SlDetails } from '@shoelace-style/shoelace'
import { LitElement, css, html } from 'lit'
import { customElement, property, state } from 'lit/decorators.js'
import { createRef, ref, type Ref } from 'lit/directives/ref.js'

import { theme } from '@/theme/theme'

import { ProjectDetailsFinding } from '@/modules/projects/types/project-details'

import { projectFindingsQuery } from '@/modules/projects/queries/project-finding-query'
import { projectFindingKey } from '@/modules/projects/utils/project-finding-key'

import { findingMarkdownHtml } from '@/features/project-detail/utils/finding-markdown-html'

import { createLogger } from '@/utils/logging/create-logger'

const ELEMENT_NAME = 'finding-details-item'

const logger = createLogger(ELEMENT_NAME)

@customElement(ELEMENT_NAME)
export class FindingDetailsItem extends SignalWatcher(LitElement) {
  private detailsRef: Ref<SlDetails> = createRef()

  @property()
  private finding!: ProjectDetailsFinding
  @property()
  private projectId = 0
  @property()
  private baseUrl = ''
  @state()
  private fetched = false

  public disconnectedCallback() {
    super.disconnectedCallback()
    this.detailsRef.value?.removeEventListener('sl-show', () => this.onExpand())
  }

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

    value.addEventListener('sl-show', () => this.onExpand())
  }

  protected async updated(changed: Map<PropertyKey, unknown>): Promise<void> {
    if (this.fetched) {
      if (changed.has('projectId')) {
        this.fetched = false
        if (!this.detailsRef.value?.hidden) {
          await this.detailsRef.value?.hide()
        }
      }
    }
  }

  private onExpand() {
    if (!this.fetched) {
      void projectFindingsQuery.fetch([this.projectId, this.finding.iid])
      this.fetched = true
    }
  }

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

  render() {
    const { projectId, finding } = this
    const { iid, title } = finding

    const details =
      projectFindingsQuery.data?.[projectFindingKey(projectId, iid)]

    let iframe = html``

    if (details?.isLoading) {
      iframe = html`loading...`
    } else if (!details?.isLoading && details?.data) {
      iframe = html`<secure-iframe
        sandbox="allow-same-origin"
        .UNSAFE_html=${findingMarkdownHtml(finding, details.data, this.baseUrl)}
      ></secure-iframe>`
    }

    return html`<sl-details
      ${ref(this.detailsRef)}
      .iid=${iid}
      .summary=${title}
    >
      ${iframe}
    </sl-details>`
  }
}

declare global {
  interface HTMLElementTagNameMap {
    [ELEMENT_NAME]: FindingDetailsItem
  }
}
