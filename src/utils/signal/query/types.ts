export type QueryStatus = 'pending' | 'loading' | 'completed' | 'error'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type QueryResult<T = any> = {
  status: QueryStatus
  data: T | null
  error: string | null
}

export type QueryFetcher<TResult, TParams> = (
  params?: TParams
) => Promise<TResult>

export type Query<TResult, TParams> = {
  status: QueryStatus
  data: TResult | null
  error: string | null
  fetch: QueryFetcher<TResult, TParams>
}
