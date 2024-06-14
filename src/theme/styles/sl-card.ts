import { css } from 'lit'

export const slCardStyles = css`
  sl-card {
    position: relative;
    z-index: 50;
    width: 100%;
    box-shadow: var(--sl-shadow-medium);
  }

  sl-card h2 {
    margin: 0;
    font-size: var(--sl-font-size-2x-large);
    font-weight: var(--sl-font-weight-normal);
    color: var(--sl-color-primary-600);
  }
`
