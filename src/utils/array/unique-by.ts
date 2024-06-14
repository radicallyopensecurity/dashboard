export const uniqueBy = <T>(fn: (obj: T) => string | number, arr: T[]): T[] => {
  const dictionary: Record<string, boolean> = {}

  const result = arr.filter((x) => {
    const key = fn(x)

    if (dictionary[key]) {
      return false
    }

    dictionary[key] = true
    return true
  })

  return result
}
