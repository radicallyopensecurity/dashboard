import { MobxLitElement } from '@adobe/lit-mobx'
import { Router } from '@lit-labs/router'
import { setBasePath } from '@shoelace-style/shoelace/dist/utilities/base-path.js'
import { html, css } from 'lit'
import { customElement } from 'lit/decorators.js'

import { registerTheme } from '@/theme/register-theme'
import { theme } from '@/theme/theme'

import { authClient } from '@/auth/auth-client'
import { ensureAuth } from '@/auth/ensure-auth'

import { gitlabClient } from '@/api/gitlab/gitlab-client'

import { projects } from '@/state/projects'
import { user } from '@/state/user'

import { createLogger } from '@/utils/logging/create-logger'
import { versionValues } from '@/utils/version/version-values'

import { routes } from '@/routes'

import '@shoelace-style/shoelace/dist/components/avatar/avatar.js'
import '@shoelace-style/shoelace/dist/components/button/button.js'
import '@shoelace-style/shoelace/dist/components/card/card.js'
import '@shoelace-style/shoelace/dist/components/icon/icon.js'
import '@shoelace-style/shoelace/dist/components/icon-button/icon-button.js'
import '@shoelace-style/shoelace/dist/components/input/input.js'
import '@shoelace-style/shoelace/dist/components/skeleton/skeleton.js'
import '@shoelace-style/shoelace/dist/components/tab/tab.js'
import '@shoelace-style/shoelace/dist/components/tab-group/tab-group.js'
import '@shoelace-style/shoelace/dist/components/tab-panel/tab-panel.js'

import '@/pages/auth/callback'
import '@/pages/not-found'

import '@/components/top-bar/top-bar'
import '@/components/secure-iframe/secure-iframe'
import '@/components/side-bar/side-bar'
import '@/components/version-footer/version-footer'

import '@/theme/light.css'
import '@/theme/dark.css'
import '@/theme/base.css'

const FOOTER_VALUES = versionValues()

setBasePath('/')

const ELEMENT_NAME = 'app-shell'

const logger = createLogger(ELEMENT_NAME)

@customElement(ELEMENT_NAME)
export class AppShell extends MobxLitElement {
  private router = new Router(this, routes)

  private user = user
  private projects = projects

  protected async firstUpdated() {
    registerTheme()
    await ensureAuth(window.location.pathname)

    // #TODO: create services that encapsulate this logic
    logger.info('getting base app data')
    this.projects.setIsLoading(true)

    await Promise.all([
      authClient.userInfoAsync().then((data) => this.user.fromUserInfo(data)),
      gitlabClient.user().then((data) => this.user.fromGitLabUser(data)),
      gitlabClient
        .allProjects()
        .then((data) => this.projects.fromAllProjects(data))
        .then(() => this.projects.setIsLoading(false)),
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

      #routes {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        width: 100%;
        overflow-y: auto;
      }

      #content {
        padding: var(--content-padding);
      }
    `,
  ]

  render() {
    return html`<top-bar></top-bar>
      <main>
        <side-bar></side-bar>
        <div id="routes">
          <div id="content">${this.router.outlet()}</div>
          <version-footer .values=${FOOTER_VALUES}></version-footer>
        </div>
      </main>`
  }
}

declare global {
  interface HTMLElementTagNameMap {
    [ELEMENT_NAME]: AppShell
  }
}
