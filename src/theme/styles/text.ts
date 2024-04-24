import { css } from 'lit'

export const textStyles = css`
  :host {
    font-family: var(--sl-font-sans);
    font-size: var(--sl-font-size-medium);
    line-height: var(--sl-line-height-normal);
  }

  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    margin-top: 0;
    font-weight: var(--sl-font-weight-bold);
  }

  h1 {
    font-size: var(--sl-font-size-2x-large);
  }

  h2 {
    font-size: var(--sl-font-size-x-large);
  }

  h3 {
    font-size: var(--sl-font-size-large);
  }
`
