export type QueryStatus = 'pending' | 'loading' | 'completed' | 'error'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type QueryResult<TResult = any> = {
  status: QueryStatus
  data: TResult | null
  error: string | null
}

export type QueryFetcher<TResult, TParams> = (
  ...params: TParams[]
) => Promise<TResult>

export type Query<TResult, TParams, TIntermediate = TResult> = {
  status: QueryStatus
  data: TResult | null
  error: string | null
  fetch: QueryFetcher<TIntermediate, TParams>
  set: (current: TResult) => QueryResult<TResult>
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type QueryOptions<TParams, TResult = any, TIntermediate = any> = {
  before?: (
    cache: TResult | null,
    params: TParams,
    setValue: (partial: Partial<QueryResult<TResult>>) => QueryResult<TResult>
  ) => TResult
  after?: (params: TParams, result: TResult) => void | Promise<void>
  transform?: (result: TIntermediate, current: TResult | null) => TResult
}
