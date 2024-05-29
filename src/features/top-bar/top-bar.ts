import { MobxLitElement } from '@adobe/lit-mobx'
import {
  SlDialog,
  SlInput,
  SlMenu,
  SlMenuItem,
  SlRequestCloseEvent,
} from '@shoelace-style/shoelace'
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

import { appStore } from '@/modules/app/app-store'

const ELEMENT_NAME = 'top-bar'

@customElement(ELEMENT_NAME)
export class TopBar extends MobxLitElement {
  static styles = topBarStyles

  private user = user
  private appStore = appStore

  private buttonRefs = {
    [Theme.Dark]: createRef<SlMenuItem>(),
    [Theme.Light]: createRef<SlMenuItem>(),
    [Theme.System]: createRef<SlMenuItem>(),
  }

  private menuRef: Ref<SlMenu> = createRef()
  private gitlabTokenRef: Ref<SlInput> = createRef()
  private gitlabDialogRef: Ref<SlDialog> = createRef()

  disconnectedCallback(): void {
    super.disconnectedCallback()
    this.gitlabDialogRef.value?.removeEventListener('sl-request-close', (e) =>
      this.onOverlayClose(e)
    )
  }

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

  onOverlayClose(e: SlRequestCloseEvent) {
    if (e.detail.source === 'overlay') {
      this.appStore.setGitlabTokenDialog(false)
    }
  }

  protected firstUpdated() {
    const theme = fromLocalStorage()
    this.processChecked(theme)

    this.menuRef.value?.addEventListener('sl-select', (e) => {
      this.processChecked(e.detail.item.value as Theme, 'change')
    })

    this.gitlabDialogRef.value?.addEventListener('sl-request-close', (e) =>
      this.onOverlayClose(e)
    )
  }

  render() {
    const { avatar, name } = this.user

    const currentTheme = getTheme()
    const iconName = currentTheme === Theme.Light ? 'sun' : 'moon-stars'

    const { gitlabToken } = this.appStore

    const gitlabMode = gitlabToken ? 'danger' : 'warning'
    const gitlabModeText = gitlabToken ? 'ELEVATED ACCESS' : 'Read Access'

    const wrapperClasses = ['wrapper']

    if (gitlabToken) {
      wrapperClasses.push('wrapper-danger')
    }

    return html`<div class=${wrapperClasses.join(' ')}>
      <div id="content">
        <a id="brand" href="/"><h1>Radically Open Security</h1></a>

        ${gitlabMode === 'danger'
          ? html`<sl-badge
              @click=${() => {
                this.appStore.setGitlabToken('')
              }}
              id="gitlab-top-badge"
              variant="danger"
              pill
              pulse
              >GitLab Access Elevated<sl-icon-button
                name="x-lg"
                label="Clear"
              ></sl-icon-button>
            </sl-badge>`
          : ''}

        <sl-dropdown class="dropdown" placement="bottom-end">
          <div class="menu" slot="trigger">
            <sl-avatar id="avatar" image="${avatar}"></sl-avatar>
            <span>${name}</span>
            <sl-icon name="sliders"></sl-icon>
          </div>
          <sl-menu>
            <sl-menu-label class="menu-label">
              <sl-icon name="gitlab"></sl-icon>
              GitLab
              <sl-badge
                variant=${gitlabMode}
                pill
                ?pulse=${Boolean(gitlabToken)}
                >${gitlabModeText}
              </sl-badge>
            </sl-menu-label>
            <sl-menu-item
              @click=${() => this.appStore.setGitlabTokenDialog(true)}
            >
              <sl-icon name="pen" slot="prefix"></sl-icon>
              ${gitlabToken ? 'Change token' : 'Set token'}
            </sl-menu-item>
            ${gitlabToken
              ? html`<sl-menu-item
                  @click=${() => {
                    this.appStore.setGitlabToken('')
                    this.appStore.setGitlabTokenDialog(false)
                  }}
                >
                  <sl-icon name="x-lg" slot="prefix"></sl-icon>
                  Clear token
                </sl-menu-item>`
              : ''}
          </sl-menu>
        </sl-dropdown>
        <sl-dialog
          ${ref(this.gitlabDialogRef)}
          id="gitlab-dialog"
          class="dialog-overview"
          label="Set GitLab token"
          ?open=${this.appStore.showGitlabTokenDialog}
        >
          <sl-alert variant="danger" open>
            <sl-icon slot="icon" name="exclamation-octagon"></sl-icon>
            <strong>Warning</strong><br />
            Do not share your GitLab token with anyone
          </sl-alert>
          <sl-input
            ${ref(this.gitlabTokenRef)}
            type="password"
            value=${gitlabToken}
            password-toggle
            clearable
          ></sl-input>
          <div class="gitlab-footer" slot="footer">
            <sl-button
              variant="primary"
              @click=${() => {
                this.appStore.setGitlabToken(
                  this.gitlabTokenRef.value?.value ?? ''
                )
                this.appStore.setGitlabTokenDialog(false)
              }}
              >Save</sl-button
            >
            <sl-button
              @click=${() => {
                this.appStore.setGitlabToken('')
                this.appStore.setGitlabTokenDialog(false)
              }}
              >Remove</sl-button
            >
            <sl-button @click=${() => this.appStore.setGitlabTokenDialog(false)}
              >Close</sl-button
            >
          </div>
        </sl-dialog>

        <sl-dropdown class="dropdown" placement="bottom-end">
          <div class="menu" slot="trigger">
            <sl-icon-button id="menu-button" name=${iconName}></sl-icon-button>
          </div>
          <sl-menu ref=${ref(this.menuRef)}>
            <sl-menu-label class="menu-label"> Theme </sl-menu-label>
            <sl-menu-item
              ${ref(this.buttonRefs.light)}
              type="checkbox"
              value=${Theme.Light}
            >
              <sl-icon slot="prefix" name="sun"></sl-icon>
              Light
            </sl-menu-item>
            <sl-menu-item
              ${ref(this.buttonRefs.dark)}
              type="checkbox"
              value=${Theme.Dark}
            >
              <sl-icon slot="prefix" name="moon-stars"></sl-icon>
              Dark
            </sl-menu-item>
            <sl-divider></sl-divider>
            <sl-menu-item
              ${ref(this.buttonRefs.system)}
              type="checkbox"
              value=${Theme.System}
            >
              <sl-icon slot="prefix" name="laptop"></sl-icon>
              System
            </sl-menu-item>
          </sl-menu>
        </sl-dropdown>
      </div>
    </div>`
  }
}

declare global {
  interface HTMLElementTagNameMap {
    [ELEMENT_NAME]: TopBar
  }
}
