import { MobxLitElement } from '@adobe/lit-mobx'
import { html, css } from 'lit'
import { customElement } from 'lit/decorators.js'

import { theme } from '@/theme/theme'

import { user } from '@/state/user'

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
        display: flex;
        align-items: center;
        justify-content: flex-end;
        height: 60px;
        padding: 0 var(--sl-spacing-large);
        background: var(--sl-color-gray-200);

        --avatar-size: 32px;
      }

      .content {
        display: flex;
        gap: var(--sl-spacing-small);
        align-items: center;
      }

      .avatar::part(base) {
        width: var(--avatar-size);
        height: var(--avatar-size);
      }
    `,
  ]

  render() {
    this.classList.add('sl-theme-dark')
    const { avatar, name } = this.user

    return html`<div class="content">
      <sl-avatar class="avatar" image="${avatar}"></sl-avatar>
      <span>${name}</span><sl-icon name="sliders"></sl-icon>
    </div>`
  }
}

declare global {
  interface HTMLElementTagNameMap {
    [ELEMENT_NAME]: TopBar
  }
}
