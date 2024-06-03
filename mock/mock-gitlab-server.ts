// eslint-disable-next-line import/no-extraneous-dependencies
import proxy from '@fastify/http-proxy'
// eslint-disable-next-line import/no-extraneous-dependencies
import Fastify from 'fastify'
// eslint-disable-next-line import/no-extraneous-dependencies, import/order
import cors from '@fastify/cors'

import { mockDatabase } from './mock-database'

const fastify = Fastify({
  logger: true,
})

await fastify.register(cors, {})

const OIDC_PREFIXES = [
  '/.well-known',
  '/jwks',
  '/token',
  '/authorize',
  '/userinfo',
  '/revoke',
  '/endsession',
  '/introspect',
]

for (const prefix of OIDC_PREFIXES) {
  await fastify.register(proxy, {
    upstream: 'http://localhost:3001',
    prefix,
    rewritePrefix: prefix,
  })
}

fastify.get('/api/v4/user', async (_, res) => {
  await res.send(mockDatabase.user())
})

fastify.get('/api/v4/groups', async (_, res) => {
  await res.send(mockDatabase.groups())
})

fastify.get(
  '/api/v4/projects/:id/issues/:iid/discussions',
  async (req, res) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-member-access
    const iid = Number((req.params as any).iid)
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-member-access
    const page = Number((req.query as any).page)
    await res.send(mockDatabase.discussions(iid, page))
  }
)

fastify.get('/api/v4/projects/:id/events', async (_, res) => {
  await res.send(mockDatabase.events())
})

fastify.get('/api/v4/projects/:id/issues', async (_, res) => {
  await res.send(mockDatabase.issues())
})

fastify.get('/api/v4/projects/:id/labels', async (_, res) => {
  await res.send(mockDatabase.labels())
})

fastify.get('/api/v4/projects/:id/members', async (_, res) => {
  await res.send(mockDatabase.members())
})

fastify.get('/api/v4/projects/:id/variables', async (_, res) => {
  await res.send(mockDatabase.variables())
})

fastify.get('/api/v4/projects', async (req, res) => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-member-access
  const page = Number((req.query as any).page)
  await res.send(mockDatabase.projects(page))
})

fastify.post('/api/v4/projects/:id/variables', async (req, res) => {
  await res.send(req.body)
})

fastify.post('/api/v4/projects/:id/access_tokens', async (req, res) => {
  await res.send(req.body)
})

fastify.post('/api/v4/projects/:id', async (req, res) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-member-access
  const id = Number((req.params as any).id)
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-member-access
  const topics = (req.body as any).topics as string[]
  await res.send(mockDatabase.updateProject(id, topics))
})

fastify.post('/api/v4/projects', async (req, res) => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-explicit-any
  const { path, namespace_id } = req.body as any
  await res.send(
    mockDatabase.createProject(path as string, Number(namespace_id))
  )
})

const start = async () => {
  try {
    await fastify.listen({ port: 3000 })
    fastify.log.info(`Server running on http://localhost:3000`)
  } catch (err) {
    fastify.log.error(err)
    process.exit(1)
  }
}

await start()
