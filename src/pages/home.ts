import { LitElement, html } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import { authClient } from '../auth/auth-client'

const ELEMENT_NAME = 'home-page'

@customElement(ELEMENT_NAME)
export class HomePage extends LitElement {
  @property({ type: String })
  private userInfo: any = null
  @property({ type: String })
  private tokens: any = null

  protected async firstUpdated() {
    this.userInfo = JSON.stringify(await authClient.userInfoAsync(), null, 2)
    this.tokens = JSON.stringify(authClient.tokens, null, 2)
  }

  render() {
    return html`<h1>Home Page</h1>
      <div>
        <h2>GitLab</h2>
        <h3>User Info</h3>
        <pre style="text-wrap: wrap; overflow-wrap: break-word">
${this.userInfo}
        </pre
        >
      </div>
      <div>
        <h3>Tokens</h3>
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

declare global {
  interface HTMLElementTagNameMap {
    [ELEMENT_NAME]: HomePage
  }
}
