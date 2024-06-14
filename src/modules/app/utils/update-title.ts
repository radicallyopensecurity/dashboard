const DEFAULT_TITLE = 'R♡S Dashboard'

export const updateTitle = (value?: string) => {
  if (!value) {
    document.title = DEFAULT_TITLE
    return
  }

  document.title = `${value} | ${DEFAULT_TITLE}`
}
