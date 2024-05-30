import { MobxLitElement } from '@adobe/lit-mobx'
import { html, css } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import { createRef, ref, Ref } from 'lit/directives/ref.js'

import { theme } from '@/theme/theme'

import { themeStore } from '@/modules/app/theme-store'

const ELEMENT_NAME = 'secure-iframe'

@customElement(ELEMENT_NAME)
export class SecureIframe extends MobxLitElement {
  private themeStore = themeStore
  private ref: Ref<HTMLIFrameElement> = createRef()

  @property()
  private UNSAFE_html = ''

  private observer: MutationObserver = new MutationObserver(() => {
    this.onContentChange()
  })

  disconnectedCallback() {
    super.disconnectedCallback()
    this.observer.disconnect()
  }

  protected updated(): void {
    console.log('UPDATE')
    if (!this.ref.value) {
      return
    }

    this.observer.observe(this.ref.value, {
      attributes: true,
      childList: true,
      subtree: true,
    })

    this.ref.value.srcdoc = `
      <html>
        <head>
          <link rel="stylesheet" href="/iframe.css">
        </head>
        <body class="${themeStore.theme}">
          ${this.UNSAFE_html}
        </body>
      </html>
    `
  }

  protected onContentChange() {
    const offset =
      this.ref.value!.contentDocument?.documentElement.offsetHeight + 'px'

    setTimeout(() => {
      this.ref.value!.style.height = offset
    }, 100) // timeout value discovered empirically
    // 5 bucks if you can get rid of the timeout
  }

  static styles = [
    ...theme,
    css`
      iframe {
        width: 100%;
        height: 100%;
        border: 0;
      }
    `,
  ]

  render() {
    console.log('THEME', this.themeStore.theme)

    return html`<iframe ${ref(this.ref)} sandbox="allow-same-origin"></iframe>`
  }
}

declare global {
  interface HTMLElementTagNameMap {
    [ELEMENT_NAME]: SecureIframe
  }
}
