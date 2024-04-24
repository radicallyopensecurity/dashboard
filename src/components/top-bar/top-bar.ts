import { MobxLitElement } from '@adobe/lit-mobx'
import { html, css } from 'lit'
import { customElement } from 'lit/decorators.js'

import { user } from '@/state/user'

import { theme } from '@/theme/theme'

const ELEMENT_NAME = 'top-bar'

declare global {
  interface HTMLElementTagNameMap {
    [ELEMENT_NAME]: NavBar
  }
}

@customElement(ELEMENT_NAME)
export class NavBar extends MobxLitElement {
  private user = user

  static styles = [
    ...theme,
    css`
      :host {
        background: black;
      }
    `,
  ]

  render() {
    return html`<div>${this.user.name}</div>`
  }
}
