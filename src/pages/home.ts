import { LitElement, html } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import { eyedpOidc } from '../auth/eyedp-oidc'

const ELEMENT_NAME = 'home-page'

declare global {
  interface HTMLElementTagNameMap {
    [ELEMENT_NAME]: HomePage
  }
}

@customElement(ELEMENT_NAME)
export class HomePage extends LitElement {
  @property({ type: String })
  private userInfo: any = null
  @property({ type: String })
  private tokens: any = null

  protected async firstUpdated() {
    this.userInfo = JSON.stringify(await eyedpOidc.userInfoAsync(), null, 2)
    this.tokens = JSON.stringify(eyedpOidc.tokens, null, 2)
  }

  render() {
    return html`<h1>Home Page</h1>
      <div>
        <h2>User Info</h2>
        <pre style="text-wrap: wrap; overflow-wrap: break-word">
${this.userInfo}
        </pre
        >
      </div>
      <div>
        <h2>Tokens</h2>
        <blockquote>
          <strong>Gronke Challenge</strong>: Try to grab this access_token
        </blockquote>
        <pre style="text-wrap: wrap; overflow-wrap: break-word">
${this.tokens}
        </pre
        >
      </div>`
  }
}
