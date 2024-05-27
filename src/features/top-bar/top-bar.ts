import { MobxLitElement } from '@adobe/lit-mobx'
import { SlMenu, SlMenuItem } from '@shoelace-style/shoelace'
import { html } from 'lit'
import { customElement } from 'lit/decorators.js'
import { Ref, createRef, ref } from 'lit/directives/ref.js'

import {
  Theme,
  fromLocalStorage,
  getTheme,
  registerTheme,
  setLocalStorage,
} from '@/theme/utils/register-theme'

import { user } from '@/modules/user/user-store'

import { topBarStyles } from './top-bar.style'
import { toggleCheckBoxes } from './utils/toggle-checkboxes'

const ELEMENT_NAME = 'top-bar'

// TODO: settings menu
// TODO: navigation drawer button
// TODO: back button
// TODO: project title
@customElement(ELEMENT_NAME)
export class TopBar extends MobxLitElement {
  static styles = topBarStyles

  private user = user

  private buttonRefs = {
    [Theme.Dark]: createRef<SlMenuItem>(),
    [Theme.Light]: createRef<SlMenuItem>(),
    [Theme.System]: createRef<SlMenuItem>(),
  }

  private menuRef: Ref<SlMenu> = createRef()

  private processChecked(
    theme: Theme,
    mode: 'first-run' | 'change' = 'first-run'
  ) {
    toggleCheckBoxes(theme, this.buttonRefs)

    if (mode === 'change') {
      setLocalStorage(theme)
      registerTheme('once')
      this.requestUpdate()
    }
  }

  protected firstUpdated() {
    const theme = fromLocalStorage()
    this.processChecked(theme)

    this.menuRef.value?.addEventListener('sl-select', (e) => {
      this.processChecked(e.detail.item.value as Theme, 'change')
    })
  }

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
            ${ref(this.buttonRefs.light)}
            type="checkbox"
            value=${Theme.Light}
            >Light</sl-menu-item
          >
          <sl-menu-item
            ${ref(this.buttonRefs.dark)}
            type="checkbox"
            value=${Theme.Dark}
            >Dark</sl-menu-item
          >
          <sl-divider></sl-divider>
          <sl-menu-item
            ${ref(this.buttonRefs.system)}
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
