import { LitElement, html, css } from 'lit'
import { customElement, property } from 'lit/decorators.js'

import { theme } from '@/theme/theme'

import { type VersionValue } from '@/utils/version/version-values'

const ELEMENT_NAME = 'version-footer'

@customElement(ELEMENT_NAME)
export class VersionFooter extends LitElement {
  @property()
  values: VersionValue[] = []

  static styles = [
    ...theme,
    css`
      :host {
        padding: var(--sl-spacing-x-small);
        color: var(--sl-color-neutral-600);
        text-align: center;
        background: var(--sl-color-neutral-200);
        box-shadow: var(--sl-shadow-large);
      }

      a {
        margin: 0 var(--sl-spacing-x-small);
        color: var(--sl-color-neutral-600);
        text-decoration: none;
      }

      a:visited,
      a:active {
        color: var(--sl-color-neutral-600);
      }

      a:hover {
        color: var(--sl-color-primary-500);
      }
    `,
  ]

  render() {
    return this.values.length
      ? html`${this.values.map(
          ({ href, text }, index) =>
            html` <a href="${href}" target="_blank">${text}</a>
              ${index < this.values.length - 1 ? ' | ' : ''}`
        )}`
      : html``
  }
}

declare global {
  interface HTMLElementTagNameMap {
    [ELEMENT_NAME]: VersionFooter
  }
}
