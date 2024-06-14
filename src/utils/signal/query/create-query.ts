import { signal as createSignal } from '@lit-labs/preact-signals'

import { DEFAULT_QUERY_RESULT } from './constants'
import { Query, QueryOptions, QueryFetcher, QueryResult } from './types'

export const createQuery = <
  TResult,
  TParams = undefined,
  TIntermediate = TResult,
>(
  fetcher: QueryFetcher<TIntermediate, TParams>,
  options?: QueryOptions<TParams, TResult, TIntermediate>
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

  const fetch: QueryFetcher<TResult, TParams> = async (...params) => {
    try {
      setLoading()

      // :( need to get this typescript inference stuff to work
      // #TODO: Fix type inference

      if (options?.before) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-explicit-any
        options.before(signal.value.data, params as any, setValue)
      }

      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-explicit-any
      const data = await fetcher(...(params as any))

      const result = options?.transform
        ? options.transform(data, signal.value.data)
        : (data as TResult)

      setCompleted(result)

      if (options?.after) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unnecessary-type-assertion
        await options.after(params as any, result)
      }

      return result
    } catch (err) {
      setError((err as Error).message)
      throw err
    }
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
    fetch,
    set: (current) => {
      setValue({
        data: current,
      })
      return signal.value
    },
  }
}
