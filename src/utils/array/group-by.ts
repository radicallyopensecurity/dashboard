type Key = string | number | symbol

type GroupByFn<T> = (obj: T) => Key

type GroupByResult<T> = Record<Key, T>

export const groupBy = <T>(fn: GroupByFn<T>, arr: T[]): GroupByResult<T> => {
  const result: GroupByResult<T> = {}

  for (const val of arr) {
    const key = fn(val)
    result[key] = val
  }

  return result
}

export const groupByMultiple = <T>(
  fn: GroupByFn<T>,
  arr: T[]
): GroupByResult<T[]> => {
  const result: GroupByResult<T[]> = {}

  for (const val of arr) {
    const key = fn(val)

    if (!result[key]) {
      result[key] = []
    }

    result[key].push(val)
  }

  return result
}
