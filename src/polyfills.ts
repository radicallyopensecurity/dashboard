// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-member-access
if (!(globalThis as any).URLPattern) {
  await import('urlpattern-polyfill')
}

export {}
