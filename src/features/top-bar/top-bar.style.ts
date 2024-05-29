import { CSSResult, css } from 'lit'

import { theme } from '@/theme/theme'

export const topBarStyles: CSSResult[] = [
  ...theme,
  css`
    :host {
      --avatar-size: 42px;
      --danger-color: var(--sl-color-red-600);
      --danger-hover-color: var(--sl-color-red-500);
    }

    .wrapper {
      position: relative;
      z-index: 100;
      display: flex;
      align-items: center;
      height: 80px;
      padding: 0 0 0 var(--sl-spacing-large);
      background: var(--sl-color-primary-500);
      box-shadow: var(--sl-shadow-large);
    }

    .wrapper-danger {
      background: var(--danger-color);
    }

    #content {
      display: flex;
      flex-grow: 1;
      align-items: center;
      height: 100%;
      font-size: var(--sl-font-size-large);
      color: var(--sl-color-neutral-0);
    }

    .dropdown {
      display: flex;
      align-items: stretch;
      height: 100%;
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

    .menu {
      display: flex;
      gap: var(--sl-spacing-small);
      align-items: center;
      height: 100%;
      padding: 0 var(--sl-spacing-medium);
      color: var(--sl-color-neutral-0);
      cursor: pointer;
    }

    #menu-button {
      color: var(--sl-color-neutral-0);
    }

    .menu:hover,
    #menu-button:hover,
    #menu-button::part(base):hover {
      color: var(--sl-color-neutral-0);
      background: var(--sl-color-primary-600);
    }

    .wrapper-danger .menu:hover,
    .wrapper-danger #menu-button:hover,
    .wrapper-danger #menu-button::part(base):hover {
      color: var(--sl-color-neutral-0);
      background: var(--danger-hover-color);
    }

    sl-dialog::part(title) {
      color: var(--sl-color-neutral-1000);
    }

    sl-dialog::part(body) {
      display: flex;
      flex-direction: column;
      gap: var(--sl-spacing-medium);
    }

    .gitlab-footer {
      display: flex;
      gap: var(--sl-spacing-small);
      justify-content: end;
    }

    #gitlab-top-badge {
      margin-right: var(--sl-spacing-small);
    }

    #gitlab-top-badge,
    #gitlab-top-badge sl-icon-button::part(base) {
      color: var(--sl-color-neutral-0);
      cursor: pointer;
    }

    #gitlab-top-badge:hover sl-icon-button::part(base),
    #gitlab-top-badge::part(base):hover {
      background: var(--danger-hover-color);
    }

    .menu-label::part(base) {
      display: flex;
      gap: var(--sl-spacing-x-small);
      align-items: center;
    }
  `,
]
