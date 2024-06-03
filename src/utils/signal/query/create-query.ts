import { signal as createSignal } from '@lit-labs/preact-signals'

import { DEFAULT_QUERY_RESULT } from './constants'
import { Query, QueryFetcher, QueryResult } from './types'

export const createQuery = <TResult, TParams>(
  fetcher: QueryFetcher<TResult, TParams>
): Query<TResult, TParams> => {
  const signal = createSignal<QueryResult<TResult>>(DEFAULT_QUERY_RESULT)

  const setValue = (
    partial: Partial<QueryResult<TResult>>
  ): QueryResult<TResult> => {
    const result = {
      ...signal.value,
      ...partial,
    }
    signal.value = result
    return result
  }

  const setLoading = () => {
    return setValue({
      status: 'loading',
      error: null,
    })
  }

  const setCompleted = (data: TResult) => {
    return setValue({
      status: 'completed',
      data,
    })
  }

  const setError = (message: string) => {
    return setValue({
      status: 'error',
      error: message,
    })
  }

  return {
    get data() {
      return signal.value.data
    },
    get error() {
      return signal.value.error
    },
    get status() {
      return signal.value.status
    },
    fetch: async (params?: TParams) => {
      setLoading()
      try {
        const data = await fetcher(params)
        setCompleted(data)
        return data
      } catch (err) {
        setError((err as Error).message)
        throw err
      }
    },
  }
}
