// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-member-access
if (!(globalThis as any).URLPattern) {
  // used by @lit-labs/router
  // https://developer.mozilla.org/en-US/docs/Web/API/URLPattern#browser_compatibility
  await import('urlpattern-polyfill')
}

// top level await only allowed in modules
export {}
