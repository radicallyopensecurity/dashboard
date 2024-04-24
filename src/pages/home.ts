import { MobxLitElement } from '@adobe/lit-mobx'
import { html } from 'lit'
import { customElement } from 'lit/decorators.js'

import { theme } from '@/theme/theme'

const ELEMENT_NAME = 'home-page'

@customElement(ELEMENT_NAME)
export class HomePage extends MobxLitElement {
  static styles = [...theme]

  render() {
    return html`<h1>Home Page</h1>`
  }
}

declare global {
  interface HTMLElementTagNameMap {
    [ELEMENT_NAME]: HomePage
  }
}
