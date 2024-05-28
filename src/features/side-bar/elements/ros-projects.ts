import { SlInput } from '@shoelace-style/shoelace'
import { LitElement, html, css } from 'lit'
import { customElement, property, state } from 'lit/decorators.js'
import { Ref, createRef, ref } from 'lit/directives/ref.js'

import { theme } from '@/theme/theme'

import { type Project } from '@/modules/projects/types/project'

import '@/features/side-bar/elements/project-list-item'
import { filterProjects } from '../utils'

const ELEMENT_NAME = 'ros-projects'

@customElement(ELEMENT_NAME)
export class RosProjects extends LitElement {
  @property()
  private projects!: Project[]

  @property()
  private newProjectHref!: string

  @property()
  private onReload!: () => undefined

  @property()
  private isLoading = true

  @state()
  private search = ''

  private inputRef: Ref<SlInput> = createRef()

  disconnectedCallback(): void {
    super.disconnectedCallback()
    this.inputRef.value?.removeEventListener('sl-input', () =>
      this.onChangeSearch()
    )
  }

  private onChangeSearch() {
    this.search = this.inputRef.value?.value ?? ''
  }

  protected firstUpdated(): void {
    this.inputRef.value?.addEventListener('sl-input', () => {
      this.onChangeSearch()
    })
  }

  static styles = [
    ...theme,
    css`
      #projects-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
      }

      #projects-header sl-button {
        justify-self: flex-end;
      }

      #search {
        display: flex;
        flex-direction: column;
        gap: var(--sl-spacing-medium);
        padding-top: var(--sl-spacing-medium);
      }

      #search-input,
      #search-input::part(form-control) {
        display: inline-block;
        width: 100%;
        color: var(--sl-color-gray-600);
      }

      #search-input sl-icon {
        color: var(--sl-color-gray-600);
      }

      #search-input::part(input)::placeholder {
        color: var(--sl-color-gray-500);
      }

      #search-results {
        display: flex;
        flex-direction: column;
        gap: var(--sl-spacing-small);
      }
    `,
  ]

  render() {
    const { projects, newProjectHref, onReload } = this

    const filtered = filterProjects(projects, this.search)

    return html`
      <header id="projects-header">
        <h2 part="heading">Projects</h2>
        <div>
          <sl-button
            ?loading=${this.isLoading}
            ?disabled=${this.isLoading}
            size="small"
            @click=${onReload}
          >
            <sl-icon slot="suffix" name="arrow-counterclockwise"></sl-icon
            >Reload
          </sl-button>
          <sl-button size="small" variant="primary" href=${newProjectHref}>
            <sl-icon slot="suffix" name="plus-lg"></sl-icon>
            New Project
          </sl-button>
        </div>
      </header>

      <div id="search">
        <sl-input
          ${ref(this.inputRef)}
          id="search-input"
          placeholder="pen-ie11..."
          size="medium"
          clearable
        >
          <sl-icon value=${this.search} name="search" slot="suffix"></sl-icon>
        </sl-input>

        <div id="search-results">
          ${filtered.map(
            (project) =>
              html`<project-list-item
                .project="${project}"
              ></project-list-item>`
          )}
        </div>
      </div>
    `
  }
}

declare global {
  interface HTMLElementTagNameMap {
    [ELEMENT_NAME]: RosProjects
  }
}
