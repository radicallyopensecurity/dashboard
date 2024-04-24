import { MobxLitElement } from '@adobe/lit-mobx'
import { setBasePath } from '@shoelace-style/shoelace/dist/utilities/base-path.js'
import { html, css } from 'lit'
import { customElement } from 'lit/decorators.js'

import { ensureAuth } from '@/auth/ensure-auth'

import { registerTheme } from '@/utils/browser/register-theme'

import { gitlabClient } from '@/api/gitlab/gitlab-client'

import { projects } from '@/state/projects'
import { user } from '@/state/user'

import { theme } from '@/theme/theme'

import '@shoelace-style/shoelace/dist/components/avatar/avatar.js'
import '@shoelace-style/shoelace/dist/components/icon/icon.js'

import '@/theme/light.css'
import '@/theme/dark.css'
import '@/theme/base.css'
import { createLogger } from './utils/logging/create-logger'

setBasePath('/')

const ELEMENT_NAME = 'app-shell'

const logger = createLogger(ELEMENT_NAME)

@customElement(ELEMENT_NAME)
export class AppShell extends MobxLitElement {
  private user = user
  private projects = projects

  protected async firstUpdated() {
    registerTheme()
    await ensureAuth(window.location.pathname)

    logger.info('getting base app data')

    await Promise.all([
      gitlabClient.user().then((data) => this.user.setFromGitLabUser(data)),
      gitlabClient
        .allProjects()
        .then((data) => this.projects.setFromGitlabProjects(data)),
    ])
  }

  static styles = [
    ...theme,
    css`
      :host {
        height: 100%;
      }

      main {
        display: flex;
        height: calc(100% - 60px);
        background: var(--sl-color-gray-50);
      }
    `,
  ]

  render() {
    return html`<top-bar></top-bar>
      <main>
        <side-bar></side-bar>
        <app-routes></app-routes>
      </main>`
  }
}

declare global {
  interface HTMLElementTagNameMap {
    [ELEMENT_NAME]: AppShell
  }
}
