import { MobxLitElement } from '@adobe/lit-mobx'
import { html, css } from 'lit'
import { customElement } from 'lit/decorators.js'

import { user } from '@/state/user'

import { theme } from '@/theme/theme'

const ELEMENT_NAME = 'top-bar'

// TODO: settings menu
// TODO: navigation drawer button
// TODO: back button
// TODO: project title
@customElement(ELEMENT_NAME)
export class TopBar extends MobxLitElement {
  private user = user

  static styles = [
    ...theme,
    css`
      :host {
        height: 60px;
        background: var(--sl-color-gray-200);
        display: flex;
        align-items: center;
        justify-content: flex-end;
        padding: 0 var(--sl-spacing-large);
      }

      .top-bar__content {
        display: flex;
        align-items: center;
        gap: var(--sl-spacing-small);
      }

      .top-bar__avatar::part(base) {
        width: 32px;
        height: 32px;
      }
    `,
  ]

  render() {
    const { avatar, name } = this.user

    return html`<div class="top-bar__content">
      <sl-avatar class="top-bar__avatar" image="${avatar}"></sl-avatar>
      <span>${name}</span><sl-icon name="sliders"></sl-icon>
    </div>`
  }
}

declare global {
  interface HTMLElementTagNameMap {
    [ELEMENT_NAME]: TopBar
  }
}
