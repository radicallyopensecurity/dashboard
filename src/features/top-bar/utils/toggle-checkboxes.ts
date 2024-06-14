import { type Ref } from 'lit/directives/ref.js'

import { type Theme } from '@/theme/utils/register-theme'

export const toggleCheckBoxes = (
  theme: Theme,
  refs: {
    [Theme.Dark]: Ref<HTMLElement>
    [Theme.Light]: Ref<HTMLElement>
    [Theme.System]: Ref<HTMLElement>
  }
) => {
  const entries = Object.entries(refs) as [Theme, Ref<HTMLElement>][]

  const toSet = entries.find(([key]) => key === theme)
  const toRemove = entries.filter(([key]) => key !== theme)

  if (toSet) {
    toSet[1].value?.setAttribute('checked', 'true')
  }

  toRemove.forEach((entry) => entry[1].value?.removeAttribute('checked'))
}
