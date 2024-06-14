import { signal as createSignal } from '@lit-labs/preact-signals'

import { Theme } from '@/theme/utils/register-theme'

const signal = createSignal<Theme>('light' as Theme)

export const themeSignal = {
  get theme() {
    return signal.value
  },
  set: (theme: Theme) => {
    signal.value = theme
  },
}
