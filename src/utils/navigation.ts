// DOESNT WORK. LIT ROUTING SUCKS
export const navigateTo = (path: string): void => {
  globalThis.history.pushState({}, '', path)
}
