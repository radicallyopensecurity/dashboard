import { LitElement, html } from 'lit'
import { customElement } from 'lit/decorators.js'

const ELEMENT_NAME = 'auth-gitlab-callback'

declare global {
  interface HTMLElementTagNameMap {
    [ELEMENT_NAME]: AuthGitlabCallback
  }
}

@customElement(ELEMENT_NAME)
export class AuthGitlabCallback extends LitElement {
  render() {
    return html` <h1>Auth GitLab Callback</h1>`
  }
}
