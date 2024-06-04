import './polyfills'
import { provide } from '@lit/context'
import { Router } from '@lit-labs/router'
import { setBasePath } from '@shoelace-style/shoelace/dist/utilities/base-path.js'
import { html, css, LitElement } from 'lit'
import { customElement } from 'lit/decorators.js'
import { createRef, ref } from 'lit/directives/ref.js'

import { config } from '@/config'

import { theme } from '@/theme/theme'
import { registerTheme } from '@/theme/utils/register-theme'

import { routerContext, routes } from '@/routes'

import { isDefined } from '@/utils/object/is-defined'
import { versionValues } from '@/utils/version/version-values'

import { ChatServiceResult, chatService } from '@/modules/chat/chat-service'

import '@shoelace-style/shoelace/dist/components/alert/alert.js'
import '@shoelace-style/shoelace/dist/components/avatar/avatar.js'
import '@shoelace-style/shoelace/dist/components/badge/badge.js'
import '@shoelace-style/shoelace/dist/components/button/button.js'
import '@shoelace-style/shoelace/dist/components/card/card.js'
import '@shoelace-style/shoelace/dist/components/details/details.js'
import '@shoelace-style/shoelace/dist/components/dialog/dialog.js'
import '@shoelace-style/shoelace/dist/components/divider/divider.js'
import '@shoelace-style/shoelace/dist/components/dropdown/dropdown.js'
import '@shoelace-style/shoelace/dist/components/icon/icon.js'
import '@shoelace-style/shoelace/dist/components/icon-button/icon-button.js'
import '@shoelace-style/shoelace/dist/components/input/input.js'
import '@shoelace-style/shoelace/dist/components/menu/menu.js'
import '@shoelace-style/shoelace/dist/components/menu-item/menu-item.js'
import '@shoelace-style/shoelace/dist/components/menu-label/menu-label.js'
import '@shoelace-style/shoelace/dist/components/option/option.js'
import '@shoelace-style/shoelace/dist/components/select/select.js'
import '@shoelace-style/shoelace/dist/components/skeleton/skeleton.js'
import '@shoelace-style/shoelace/dist/components/tooltip/tooltip.js'

import '@/elements/secure-iframe/secure-iframe'
import '@/elements/version-footer/version-footer'

import '@/features/side-bar/side-bar'
import '@/features/top-bar/top-bar'

import '@/pages/not-found'

import '@/theme/light.css'
import '@/theme/dark.css'
import '@/theme/base.css'

const FOOTER_VALUES = versionValues()

setBasePath('/')

const ELEMENT_NAME = 'app-shell'

@customElement(ELEMENT_NAME)
export class AppShell extends LitElement {
  @provide({ context: routerContext })
  private router = new Router(this, routes)

  iframeRef = createRef<HTMLIFrameElement>()
  chat: ChatServiceResult | null = null

  public disconnectedCallback(): void {
    this.chat?.disconnect()
    super.disconnectedCallback()
  }

  protected firstUpdated() {
    registerTheme()
    if (isDefined(this.iframeRef.value)) {
      this.chat = chatService(this.iframeRef.value)
    }
  }

  static styles = [
    ...theme,
    css`
      :host {
        height: 100%;
      }

      main {
        display: flex;
        height: calc(100% - 80px);
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

      #chat {
        display: none;
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
      </main>
      <iframe
        ${ref(this.iframeRef)}
        sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
        referrerpolicy="origin"
        src=${config.services.rocketChatUrl}
        id="chat"
      ></iframe>`
  }
}

declare global {
  interface HTMLElementTagNameMap {
    [ELEMENT_NAME]: AppShell
  }
}
