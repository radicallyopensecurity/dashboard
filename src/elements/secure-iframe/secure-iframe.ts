import { SignalWatcher } from '@lit-labs/preact-signals'
import { html, css, LitElement } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import { createRef, ref, Ref } from 'lit/directives/ref.js'

import { theme } from '@/theme/theme'

import { themeSignal } from '@/modules/app/signals/theme-signal'

const ELEMENT_NAME = 'secure-iframe'

@customElement(ELEMENT_NAME)
export class SecureIframe extends SignalWatcher(LitElement) {
  private ref: Ref<HTMLIFrameElement> = createRef()

  @property()
  private sandbox = ''

  @property()
  private UNSAFE_html = ''

  private mutationObserver: MutationObserver = new MutationObserver(() => {
    this.resizeIframe()
  })

  private resizeObserver: ResizeObserver = new ResizeObserver(() => {
    this.resizeIframe()
  })

  disconnectedCallback() {
    super.disconnectedCallback()
    this.mutationObserver.disconnect()
    this.resizeObserver.disconnect()
  }

  protected updated(): void {
    if (!this.ref.value) {
      return
    }

    this.mutationObserver.observe(this.ref.value, {
      attributes: true,
      childList: true,
      subtree: true,
    })

    this.resizeObserver.observe(this.ref.value)

    this.ref.value.srcdoc = `
      <html>
        <head>
          <link rel="stylesheet" href="/iframe.css">
        </head>
        <body class="${themeSignal.theme}">
          ${this.UNSAFE_html}
        </body>
      </html>
    `
  }

  protected resizeIframe() {
    const offsetHeight =
      this.ref.value!.contentDocument?.documentElement.offsetHeight ?? 0
    const offset = `${offsetHeight + 18}px`

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
    return html`<iframe ${ref(this.ref)} sandbox=${this.sandbox}></iframe>`
  }
}

declare global {
  interface HTMLElementTagNameMap {
    [ELEMENT_NAME]: SecureIframe
  }
}
