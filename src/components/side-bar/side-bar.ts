import { MobxLitElement } from '@adobe/lit-mobx'
import { html, css } from 'lit'
import { customElement } from 'lit/decorators.js'

import { theme } from '@/theme/theme'

import { SERVICES } from '@/components/side-bar/constants'

import { projects } from '@/state/projects'

import '@/components/project-list-item/project-list-item'

const ELEMENT_NAME = 'side-bar'

@customElement(ELEMENT_NAME)
export class SideBar extends MobxLitElement {
  private projects = projects

  static styles = [
    ...theme,
    css`
      :host {
        position: relative;
        z-index: 60;
        display: flex;
        flex-direction: column;
        gap: var(--sl-spacing-medium);
        min-width: 324px;
        max-width: 324px;
        padding: var(--content-padding);
        overflow-y: auto;
        background: white;
      }

      h2 {
        margin-bottom: 0;
        font-size: var(--sl-font-size-medium);
        font-weight: var(--sl-font-weight-normal);
        color: var(--sl-color-neutral-600);
        text-transform: uppercase;
      }

      #services {
        display: grid;
        grid-template-columns: auto auto;
        grid-gap: var(--sl-spacing-small);
        padding: var(--sl-spacing-medium);
      }

      #services a:link {
        color: var(--sl-color-neutral-500);
        text-decoration: none;
      }

      #services a:hover {
        color: var(--sl-color-primary-500);
      }

      .services-item span {
        display: flex;
        gap: var(--sl-spacing-x-small);
        align-items: baseline;
      }

      .service-item sl-icon {
        margin-right: var(--sl-spacing-3x-small);
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
      }

      #projects-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
      }

      #projects-header sl-button {
        justify-self: flex-end;
      }

      #search-results {
        display: flex;
        flex-direction: column;
        gap: var(--sl-spacing-small);
      }
    `,
  ]
  render() {
    const { all } = this.projects
    const sorted = all.slice().sort((a, b) => a.name.localeCompare(b.name))

    return html`<section>
        <h2>ROS Services</h2>
        <div id="services">
          ${SERVICES.map(
            ({ title, icon, href }) =>
              html` <a class="services-item" href="${href}" target="_blank">
                <span> <sl-icon name="${icon}"></sl-icon>${title}</span>
              </a>`
          )}
        </div>
      </section>
      <section id="projects">
        <header id="projects-header">
          <h2>Projects</h2>
          <div>
            <sl-button size="small">
              <sl-icon slot="suffix" name="arrow-counterclockwise"></sl-icon
              >Reload
            </sl-button>
            <sl-button size="small" variant="primary">
              <sl-icon slot="suffix" name="plus-lg"></sl-icon>
              New Project
            </sl-button>
          </div>
        </header>

        <div id="search">
          <sl-input id="search-input" placeholder="pen-ie11" size="medium">
            <sl-icon name="search" slot="suffix"></sl-icon>
          </sl-input>

          <div id="search-results">
            ${sorted.map(
              (project) =>
                html`<project-list-item
                  .project="${project}"
                ></project-list-item>`
            )}
          </div>
        </div>
      </section>`
  }
}

declare global {
  interface HTMLElementTagNameMap {
    [ELEMENT_NAME]: SideBar
  }
}
