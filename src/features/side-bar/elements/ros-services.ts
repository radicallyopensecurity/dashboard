import { LitElement, html, css } from 'lit'
import { customElement, property } from 'lit/decorators.js'

import { theme } from '@/theme/theme'

import { type Service } from '@/features/side-bar/constants'

const ELEMENT_NAME = 'ros-services'

@customElement(ELEMENT_NAME)
export class RosServices extends LitElement {
  @property()
  private services: Service[] = []

  static styles = [
    ...theme,
    css`
      #services {
        display: grid;
        grid-template-columns: auto auto;
        grid-gap: var(--sl-spacing-small);
        padding: var(--sl-spacing-medium);
      }

      #services a:link,
      #services a:active,
      #services a:visited {
        color: var(--sl-color-gray-600);
        text-decoration: none;
      }

      #services a:hover {
        color: var(--sl-color-primary-500);
      }

      .services-item span {
        display: flex;
        gap: var(--sl-spacing-x-small);
        align-items: baseline;
      }

      .service-item sl-icon {
        margin-right: var(--sl-spacing-3x-small);
      }
    `,
  ]

  render() {
    const { services } = this

    return html`
      <h2 part="heading">ROS Services</h2>
      <div id="services">
        ${services.map(
          ({ title, icon, href }) =>
            html` <a class="services-item" href="${href}" target="_blank">
              <span> <sl-icon name="${icon}"></sl-icon>${title}</span>
            </a>`
        )}
      </div>
    `
  }
}

declare global {
  interface HTMLElementTagNameMap {
    [ELEMENT_NAME]: RosServices
  }
}
