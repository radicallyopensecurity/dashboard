// eslint-disable-next-line import/no-extraneous-dependencies, import/no-named-as-default
import concurrently from 'concurrently'

const { result } = concurrently([
  {
    name: 'mock-oidc',
    command: `npm run nodemon -- \
      -e ts \
      --watch ./mock/mock-oidc-server.ts \
      --exec npm run dev:mock:oidc`,
    prefixColor: 'blue',
  },
  {
    name: 'mock-gitlab',
    command: `npm run nodemon -- \
      -e ts \
      --watch ./mock \
      --ignore ./mock/mock-oidc-server.ts \
      --exec npm run dev:mock:gitlab`,
    prefixColor: 'magenta',
  },
  {
    name: 'app',
    command: 'npm run dev -- --mode mock',
    prefixColor: '#FFA500',
  },
])

await result
