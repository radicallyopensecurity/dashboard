import { MobxLitElement } from '@adobe/lit-mobx'
import { html, css } from 'lit'
import { customElement } from 'lit/decorators.js'

import { theme } from '@/theme/theme'

import { AppRoute } from '@/routes'

import { projectsService } from '@/modules/projects/projects-service'
import { projects } from '@/modules/projects/projects-store'

import { SERVICES } from '@/features/side-bar/constants'

import '@/features/side-bar/elements/ros-services'
import '@/features/side-bar/elements/ros-projects'

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
        background: var(--sl-color-neutral-0);
      }

      ros-services::part(heading),
      ros-projects::part(heading) {
        margin-bottom: 0;
        font-size: var(--sl-font-size-medium);
        font-weight: var(--sl-font-weight-normal);
        color: var(--sl-color-primary-600);
        text-transform: uppercase;
      }
    `,
  ]
  render() {
    const { all } = this.projects
    const sorted = all.slice().sort((a, b) => a.name.localeCompare(b.name))

    return html`
      <ros-services .services=${SERVICES}></ros-services>
      <ros-projects
        .projects=${sorted}
        .newProjectHref=${AppRoute.NewProject}
        .onReload=${projectsService.syncProjects}
      ></ros-projects>
    `
  }
}

declare global {
  interface HTMLElementTagNameMap {
    [ELEMENT_NAME]: SideBar
  }
}
