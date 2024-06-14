import { html, LitElement, nothing } from 'lit'
import { customElement, property } from 'lit/decorators.js'

const ELEMENT_NAME = 'sort-caret'

@customElement(ELEMENT_NAME)
export class SortCaret extends LitElement {
  @property()
  type: null | 'desc' | 'asc' = null

  protected render() {
    if (!this.type) {
      return nothing
    }

    const icon = this.type === 'asc' ? 'caret-up' : 'caret-down'

    return html` <sl-icon name=${icon}></sl-icon> `
  }
}

declare global {
  interface HTMLElementTagNameMap {
    [ELEMENT_NAME]: SortCaret
  }
}
