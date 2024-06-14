export type FetchPaginatedParameters = {
  perPage?: number
  page?: number
}

type FetchPaginatedFunction<T> = (
  params: FetchPaginatedParameters
) => Promise<T>

const PER_PAGE = 50

export const fetchPaginated = async <T>(
  fn: FetchPaginatedFunction<T[]>,
  perPage: number = PER_PAGE
) => {
  let page = 1
  let complete = false

  let data: T[] = []

  while (!complete) {
    const result = await fn({ page, perPage })

    if (!result.length) {
      complete = true
      break
    }

    data = data.concat(result)
    page += 1
  }

  return data
}
