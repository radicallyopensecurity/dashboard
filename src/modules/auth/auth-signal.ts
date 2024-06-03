import { signal } from '@lit-labs/preact-signals'

type AuthSignal = {
  isLoading: boolean
  isAuthenticated?: boolean
}

const authSignal = signal<AuthSignal>({
  isLoading: false,
  isAuthenticated: undefined,
})

const setAuth = (value: Partial<AuthSignal>) => {
  authSignal.value = {
    ...authSignal.value,
    ...value,
  }
}

export const auth = {
  signal: authSignal,
  setAuth,
  setAuthenticated: (value?: boolean) => {
    setAuth({
      isLoading: false,
      isAuthenticated: value,
    })
  },
  setLoading: (value: boolean) => {
    setAuth({
      isLoading: value,
    })
  },
}
