import { CSSResult, css } from 'lit'

import { theme } from '@/theme/theme'

export const topBarStyles: CSSResult[] = [
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
