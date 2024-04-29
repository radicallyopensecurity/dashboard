import { MobxLitElement } from '@adobe/lit-mobx'
import { SlMenu, SlMenuItem } from '@shoelace-style/shoelace'
import { html, css } from 'lit'
import { customElement } from 'lit/decorators.js'
import { Ref, createRef, ref } from 'lit/directives/ref.js'

import { theme } from '@/theme/theme'
import {
  Theme,
  fromLocalStorage,
  getTheme,
  registerTheme,
  setLocalStorage,
} from '@/theme/utils/register-theme'

import { user } from '@/modules/user/user-store'

const ELEMENT_NAME = 'top-bar'

// TODO: settings menu
// TODO: navigation drawer button
// TODO: back button
// TODO: project title
@customElement(ELEMENT_NAME)
export class TopBar extends MobxLitElement {
  private user = user

  private menuRef: Ref<SlMenu> = createRef()
  private darkRef: Ref<SlMenuItem> = createRef()
  private lightRef: Ref<SlMenuItem> = createRef()
  private systemRef: Ref<SlMenuItem> = createRef()

  private processChecked(
    theme: Theme,
    mode: 'default' | 'register' = 'default'
  ) {
    switch (theme) {
      case Theme.Dark:
        this.darkRef.value?.setAttribute('checked', 'true')
        this.lightRef.value?.removeAttribute('checked')
        this.systemRef.value?.removeAttribute('checked')
        break
      case Theme.Light:
        this.lightRef.value?.setAttribute('checked', 'true')
        this.darkRef.value?.removeAttribute('checked')
        this.systemRef.value?.removeAttribute('checked')
        break
      case Theme.System:
        this.systemRef.value?.setAttribute('checked', 'true')
        this.lightRef.value?.removeAttribute('checked')
        this.darkRef.value?.removeAttribute('checked')
        break
    }

    if (mode === 'register') {
      setLocalStorage(theme)
      registerTheme('once')
      this.requestUpdate()
    }
  }

  protected firstUpdated() {
    const theme = fromLocalStorage()
    this.processChecked(theme)

    this.menuRef.value?.addEventListener('sl-select', (e) => {
      this.processChecked(e.detail.item.value as Theme, 'register')
    })
  }

  static styles = [
    ...theme,
    css`
      :host {
        position: relative;
        z-index: 100;
        display: flex;
        align-items: center;
        height: 80px;
        padding: 0 var(--sl-spacing-large);
        background: var(--sl-color-primary-500);
        box-shadow: var(--sl-shadow-large);

        --avatar-size: 42px;
      }

      #content {
        display: flex;
        flex-grow: 1;
        gap: var(--sl-spacing-small);
        align-items: center;
        font-size: var(--sl-font-size-large);
        color: var(--sl-color-neutral-0);
      }

      #avatar::part(base) {
        width: var(--avatar-size);
        height: var(--avatar-size);
      }

      h1 {
        margin: 0;
        font-size: var(--sl-font-size-large);
        font-weight: var(--sl-font-weight-normal);
        color: var(--sl-color-neutral-0);
      }

      #brand {
        margin-right: auto;
      }

      #content a:link {
        text-decoration: none;
      }

      sl-icon-button::part(base) {
        justify-content: center;
        width: var(--avatar-size);
        height: var(--avatar-size);
        color: var(--sl-color-neutral-0);
        cursor: pointer;
      }

      sl-icon-button::part(base):hover {
        color: var(--sl-color-neutral-0);
        background: var(--sl-color-primary-600);
      }
    `,
  ]

  render() {
    const { avatar, name } = this.user

    const currentTheme = getTheme()
    const iconName = currentTheme === Theme.Light ? 'sun' : 'moon-stars'

    return html`<div id="content">
      <a id="brand" href="/"><h1>Radically Open Security</h1></a>
      <sl-avatar id="avatar" image="${avatar}"></sl-avatar>
      <span>${name}</span>
      <sl-icon name="sliders"></sl-icon>
      <sl-dropdown placement="bottom-end">
        <sl-icon-button name=${iconName} slot="trigger"></sl-icon-button>
        <sl-menu ref=${ref(this.menuRef)}>
          <sl-menu-item
            ${ref(this.lightRef)}
            type="checkbox"
            value=${Theme.Light}
            >Light</sl-menu-item
          >
          <sl-menu-item ${ref(this.darkRef)} type="checkbox" value=${Theme.Dark}
            >Dark</sl-menu-item
          >
          <sl-divider></sl-divider>
          <sl-menu-item
            ${ref(this.systemRef)}
            type="checkbox"
            value=${Theme.System}
            >System</sl-menu-item
          >
        </sl-menu>
      </sl-dropdown>
    </div>`
  }
}

declare global {
  interface HTMLElementTagNameMap {
    [ELEMENT_NAME]: TopBar
  }
}
