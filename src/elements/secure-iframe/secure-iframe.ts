import { LitElement, html, css } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import { createRef, ref, Ref } from 'lit/directives/ref.js'

import { theme } from '@/theme/theme'

const ELEMENT_NAME = 'secure-iframe'

@customElement(ELEMENT_NAME)
export class SecureIframe extends LitElement {
  @property()
  private UNSAFE_html = ''

  private ref: Ref<HTMLIFrameElement> = createRef()

  private observer: MutationObserver = new MutationObserver(() => {
    this.onContentChange()
  })

  disconnectedCallback() {
    super.disconnectedCallback()
    this.observer.disconnect()
  }

  protected onContentChange() {
    const offset =
      this.ref.value!.contentDocument?.documentElement.offsetHeight + 'px'

    setTimeout(() => {
      this.ref.value!.style.height = offset
    }, 5) // timeout value discovered empirically
    // 5 bucks if you can get rid of the timeout
  }

  protected firstUpdated(): void {
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
        <head></head>
        <body>
          ${this.UNSAFE_html}
        </body>
      </html>
    `
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
    return html`<iframe ${ref(this.ref)} sandbox="allow-same-origin"></iframe>`
  }
}

declare global {
  interface HTMLElementTagNameMap {
    [ELEMENT_NAME]: SecureIframe
  }
}
