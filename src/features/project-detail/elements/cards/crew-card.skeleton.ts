import { LitElement, html } from 'lit'
import { customElement } from 'lit/decorators.js'

import { theme } from '@/theme/theme'

const ELEMENT_NAME = 'crew-card-skeleton'

@customElement(ELEMENT_NAME)
export class CrewCardSkeleton extends LitElement {
  static styles = [...theme]

  render() {
    return html``
  }
}

declare global {
  interface HTMLElementTagNameMap {
    [ELEMENT_NAME]: CrewCardSkeleton
  }
}