import { SignalWatcher } from '@lit-labs/preact-signals'
import { ColumnDef } from '@tanstack/lit-table'
import { LitElement, html, css } from 'lit'
import { customElement, property, state } from 'lit/decorators.js'

import { theme } from '@/theme/theme'

import { Project } from '@/modules/projects/types/project'

import {
  ProjectWithChannelNames,
  addChannelNames,
} from '@/modules/projects/utils/add-channel-names'

import { createColumns } from './columns'

import { chatSubscriptionsSignal } from '@/modules/chat/signals/chat-subscriptions-signal'

import '@/elements/data-table/data-table'

const ELEMENT_NAME = 'projects-overview'

@customElement(ELEMENT_NAME)
export class ProjectsOverview extends SignalWatcher(LitElement) {
  @property()
  projects: Project[] = []

  @state()
  columns: ColumnDef<ProjectWithChannelNames>[] = createColumns(new Date())

  static styles = [
    ...theme,
    css`
      :host {
        text-align: left;
      }
    `,
  ]

  render() {
    const projectsWithChannels = addChannelNames(
      this.projects,
      chatSubscriptionsSignal.subscriptions
    )

    return html`<sl-card>
      <h2>Overview</h2>
      <data-table
        .columns=${this.columns}
        .data=${projectsWithChannels}
      ></data-table>
    </sl-card> `
  }
}

declare global {
  interface HTMLElementTagNameMap {
    [ELEMENT_NAME]: ProjectsOverview
  }
}
