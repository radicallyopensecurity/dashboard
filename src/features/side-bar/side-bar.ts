import { SignalWatcher } from '@lit-labs/preact-signals'
import { html, css, LitElement } from 'lit'
import { customElement } from 'lit/decorators.js'

import { theme } from '@/theme/theme'

import { AppRoute } from '@/routes'

import { projectsQuery } from '@/modules/projects/queries/projects-query'

import { SERVICES } from '@/features/side-bar/constants'

import '@/features/side-bar/elements/ros-services'
import '@/features/side-bar/elements/ros-projects'
import { chatSubscriptionsSignal } from '@/modules/chat/signals/chat-subscriptions-signal'

const ELEMENT_NAME = 'side-bar'

@customElement(ELEMENT_NAME)
export class SideBar extends SignalWatcher(LitElement) {
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
    const all = projectsQuery.data?.all ?? []
    const sorted = all.slice().sort((a, b) => a.name.localeCompare(b.name))

    return html`
      <ros-services .services=${SERVICES}></ros-services>
      <ros-projects
        .projects=${sorted}
        .subscriptions=${chatSubscriptionsSignal.subscriptions}
        .newProjectHref=${AppRoute.NewProject}
        .onReload=${projectsQuery.fetch}
        .isLoading=${projectsQuery.status === 'loading'}
      ></ros-projects>
    `
  }
}

declare global {
  interface HTMLElementTagNameMap {
    [ELEMENT_NAME]: SideBar
  }
}
