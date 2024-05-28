export const chunks = <T>(size: number, arr: T[]): T[][] => {
  const result = arr.reduce((acc, curr, index) => {
    const mod = index % size

    if (mod === 0) {
      return [...acc, [curr]]
    }

    const last = acc[acc.length - 1]
    const init = acc.slice(0, acc.length - 1)

    return [...init, [...last, curr]]
  }, [] as T[][])

  return result
}
