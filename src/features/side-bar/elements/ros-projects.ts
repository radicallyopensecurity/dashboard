import { SignalWatcher } from '@lit-labs/preact-signals'
import { SlInput, SlSelect } from '@shoelace-style/shoelace'
import { LitElement, html, css } from 'lit'
import { customElement, property, state } from 'lit/decorators.js'
import { Ref, createRef, ref } from 'lit/directives/ref.js'

import { theme } from '@/theme/theme'

import { type Project } from '@/modules/projects/types/project'

import { addChannelNames } from '@/modules/projects/utils/add-channel-names'

import {
  SortDirection,
  SortOption,
  TypeFilter,
  filterProjects,
  sortProjects,
} from '../utils'

import { ChatSubscriptionMap } from '@/modules/chat/signals/chat-subscriptions-signal'

import '@/features/side-bar/elements/project-list-item'

const ELEMENT_NAME = 'ros-projects'

@customElement(ELEMENT_NAME)
export class RosProjects extends SignalWatcher(LitElement) {
  private searchRef: Ref<SlInput> = createRef()
  private typeFilterRef: Ref<SlSelect> = createRef()
  private sortOptionRef: Ref<SlSelect> = createRef()
  private sortDirectionRef: Ref<SlSelect> = createRef()

  @property()
  private projects!: Project[]
  @property()
  private subscriptions!: ChatSubscriptionMap
  @property()
  private newProjectHref!: string
  @property()
  private onReload!: () => undefined
  @property()
  private isLoading = true

  @state()
  private search = ''
  @state()
  private typeFilter: TypeFilter = 'all'
  @state()
  private sortOption: SortOption = 'name'
  @state()
  private sortDirection: SortDirection = 'asc'

  disconnectedCallback(): void {
    super.disconnectedCallback()

    this.searchRef.value?.removeEventListener('sl-input', () =>
      this.handleSearch()
    )

    this.typeFilterRef.value?.removeEventListener('sl-change', () => {
      this.handleType()
    })

    this.sortOptionRef.value?.removeEventListener('sl-change', () => {
      this.handleSortOption()
    })

    this.sortDirectionRef.value?.removeEventListener('sl-change', () => {
      this.handleSortDirection()
    })
  }

  protected firstUpdated(): void {
    this.searchRef.value?.addEventListener('sl-input', () => {
      this.handleSearch()
    })

    this.typeFilterRef.value?.addEventListener('sl-change', () => {
      this.handleType()
    })

    this.sortOptionRef.value?.addEventListener('sl-change', () => {
      this.handleSortOption()
    })

    this.sortDirectionRef.value?.addEventListener('sl-change', () => {
      this.handleSortDirection()
    })
  }

  private handleSearch() {
    this.search = this.searchRef.value?.value ?? ''
  }

  private handleType() {
    this.typeFilter = this.typeFilterRef.value?.value as TypeFilter
  }

  private handleSortOption() {
    this.sortOption = this.sortOptionRef.value?.value as SortOption
  }
  private handleSortDirection() {
    this.sortDirection = this.sortDirectionRef.value?.value as SortDirection
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

      #filters {
        display: flex;
        gap: var(--sl-spacing-small);
      }
    `,
  ]

  render() {
    const { projects, newProjectHref, onReload } = this

    const filtered = filterProjects(projects, this.search, this.typeFilter)

    const projectsWithChannels = addChannelNames(filtered, this.subscriptions)

    const sorted = sortProjects(
      projectsWithChannels,
      this.sortOption,
      this.sortDirection
    )

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
          ${ref(this.searchRef)}
          id="search-input"
          placeholder="pen-ie11"
          size="medium"
          clearable
        >
          <sl-icon value=${this.search} name="search" slot="suffix"></sl-icon>
        </sl-input>

        <sl-select ${ref(this.typeFilterRef)} value="all" required>
          <sl-option value="all">All Projects</sl-option>
          <sl-option value="quote">Quotes</sl-option>
          <sl-option value="pentest">Pentests</sl-option>
        </sl-select>

        <div id="filters">
          <sl-select ${ref(this.sortOptionRef)} value="name" required>
            <sl-option value="name">Name</sl-option>
            <sl-option value="gitlabActivity">GitLab</sl-option>
            <sl-option value="chatActivity">Chat</sl-option>
          </sl-select>

          <sl-select ${ref(this.sortDirectionRef)} value="asc" required>
            <sl-option value="asc">Ascending</sl-option>
            <sl-option value="dsc">Descending</sl-option>
          </sl-select>
        </div>

        <div id="search-results">
          ${sorted.map(({ project, quoteChannel, pentestChannel }) => {
            return html`<project-list-item
              .project="${project}"
              .quoteChannel=${quoteChannel}
              .pentestChannel=${pentestChannel}
            ></project-list-item>`
          })}
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
