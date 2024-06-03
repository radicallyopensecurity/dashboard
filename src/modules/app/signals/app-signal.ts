import { signal as createSignal } from '@lit-labs/preact-signals'

type AppSignalValue = { gitLabToken: string; showGitLabTokenDialog: boolean }

const signal = createSignal<AppSignalValue>({
  gitLabToken: import.meta.env.VITE_SECRET_GITLAB_TOKEN ?? '',
  showGitLabTokenDialog: false,
})

const setSignal = (partial: Partial<AppSignalValue>) => {
  signal.value = {
    ...signal.value,
    ...partial,
  }
}

export const appSignal = {
  get gitLabToken() {
    return signal.value.gitLabToken
  },
  get showGitLabTokenDialog() {
    return signal.value.showGitLabTokenDialog
  },
  set: setSignal,
  setShowGitLabTokenDialog: (value: boolean) => {
    setSignal({
      showGitLabTokenDialog: value,
    })
  },
  setGitLabToken: (value: string) => {
    setSignal({
      gitLabToken: value,
    })
  },
}

export type AppSignal = typeof appSignal
