import { OAuth2Server } from 'oauth2-mock-server'

const server = new OAuth2Server()

// Generate a new RSA key and add it to the keystore
await server.issuer.keys.generate('RS256')

// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars
server.service.on('beforeUserinfo', (response: any, _: any) => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  response.body = {
    preferred_username: 'Mock User',
  }
})

// Start the server
await server.start(3001, 'localhost')

console.log(
  'Mock OIDC Server Running:',
  `${server.issuer.url}/.well-known/openid-configuration`
)
