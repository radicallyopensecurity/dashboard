import { html } from 'lit'
import { customElement } from 'lit/decorators.js'
import { MobxLitElement } from '@adobe/lit-mobx'
import { user } from '@/state/user'

const ELEMENT_NAME = 'home-page'

@customElement(ELEMENT_NAME)
export class HomePage extends MobxLitElement {
  private user = user

  render() {
    return html`<h1>Home Page</h1>
      <div>
        <h3>User Info</h3>
        <pre style="text-wrap: wrap; overflow-wrap: break-word">
${JSON.stringify(this.user, null, 2)}
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
