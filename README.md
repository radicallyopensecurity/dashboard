# ROS Dashboard

## Dependencies

- OpenSSL (development)
- NodeJS >= 20.x
- npm => 10.x
- Docker >= 26.x

It's recommended to use a version manager such as [Volta](https://volta.sh/) for `NodeJS` if running with host installed dependencies.

App can be run through Docker without having `NodeJS` or `npm` installed. See the [Docker](#docker) section.

## Build

```sh
npm install
npm run build
```

See built files in the `dist` folder.

## Deployment

The app connects to a GitLab instance and iFrames a RocketChat instance. These need to be configured to allow the connections.

If you have an auth proxy in front of the app. That too needs to be configured.

And finally we recommend server running this app should be configured with `CSPs` and `HTTP` headers.

### GitLab Configuration

Create a new application in GitLab, make sure it has the scopes: `openid profile api`.

As callback url set `https:{domain}/auth/callback`

The GitLab instance must allow `CORS` for the domain the app runs, specifically these headers must be set:

- Access-Control-Allow-Origin: {domain}
- Access-Control-Allow-Methods: GET, POST, PATCH, PUT, DELETE, OPTIONS
- Access-Control-Allow-Headers: authorization, content-type, private-token"

In addition the GitLab instance should respond to `OPTIONS` requests with a 2xx response.

### RocketChat Configuration

`CORS` needs to be enabled in the admin panel. It can be found under `Settings -> General -> Enable Cors`. The origin of the app should be entered there as well.

The server running RocketChat should respond with the following headers:

- Access-Control-Allow-Origin: {domain}
- Access-Control-Allow-Credentials: true
- Content-Security-Policy: frame-ancestors https://{domain}

### Auth Proxy Configuration

If you have an authentication proxy before the app. Then it needs to allow CORS.

> #TODO: IS THIS STILL TRUE?

- Access-Control-Allow-Origin: {domain}
- Access-Control-Allow-Methods: GET, POST, PATCH, PUT, DELETE, OPTIONS
- Access-Control-Allow-Headers: authorization, content-type, private-token"

### App Server Configuration

We recommend the following headers and `CSPs`

Headers:

- Access-Control-Allow-Origin: NONE
  > #TODO: DOES THIS ACTUALLY WORK?
- Content-Security-Policy: script-src 'self'; default-src 'none'; connect-src 'self'; font-src 'self' data:; frame-src 'self'; img-src 'self' {gitlab} {rocketchat}; style-src 'self'

## Test

```sh
# run one time
npm run test
# run in watch mode
npm run test:watch
# run one time and get test coverage
npm run test:coverage
```

## Lint

There are several linters included to ensure consistent code style. The linter is run as a commit hook and is also tested as a GitHub actions on Pull Requests.

```sh
# lint with all linters
npm run lint
# lint with all linters and auto fix
npm run lint:fix

# eslint
npm run eslint
npm run eslint:fix

# stylelint
npm run lint:style
npm run lint:style:fix

# prettier
npm run lint:prettier
npm run lint:prettier:fix
```

## Development

### HTTPS Certificates

The dev server needs to run with `https`. This is because we use the [`window.crypto.subtle`](https://developer.mozilla.org/en-US/docs/Web/API/Crypto/subtle) library, which is only available in secure contexts.

You can use a tool such as [`mkcert`](https://github.com/FiloSottile/mkcert), or perform the steps manually.

See the convenience script [`.internal/certs/generate-certificates.sh`](.internal/certs/generate-certificates.sh) for the manual steps on Linux.

To connect to `ROS` staging, the domain name / common name must be `dashboard-local.staging.radical.sexy`. This is because the domain is registered as an OIDC application in GitLab

The certificates are read by default from the [`.internal/certs`](.internal/certs) folder in `pem` format. To store the certificates somewhere else, set the environment variables `DEV_VITE_SERVER_CRT_PATH` and `DEV_VITE_SERVER_KEY_PATH`.

### Install Dependencies

```sh
npm install
```

### Run Development Server

Copy `.env.sample` and fill in the required environment variables.

```sh
cp .env.sample .env
```

If running against `ROS` staging. Make sure your VPN connection is up.

Then start the development server.

```sh
npm run dev
```

Login to the Identity Provider in your browser.

Then access the app at: <https://dashboard-staging.radical.sexy:3443>

## Docker

You can use `Docker` to run and build the project, without installing `NodeJS` on your local machine.

See or run the convenience scripts in `.internal/docker/`.

- [`.internal/docker/npm-install.sh`](/.internal/docker/npm-install.sh)
- [`.internal/docker/npm-dev.sh`](/.internal/docker/npm-dev.sh)
- [`.internal/docker/npm-build.sh`](/.internal/docker/npm-build.sh)
- [`.internal/docker/npm-cli.sh`](/.internal/docker/npm-cli.sh)

```sh
# install
sh ./.internal/docker/npm-install.sh
# dev
sh ./.internal/docker/npm-dev.sh
# build
sh .internal/docker/npm-build.sh
# cli
sh .internal/docker/npm-cli.sh
```

## Security

### OIDC Service Worker

The app authenticates with `GitLab` through `OIDC`. The token returned through an authentication like that has high privilege, that's why we limit exposure to the key by intercepting all calls to `GitLab` through a `Service Worker`.

The token is stored in memory in the service worker, which is a separate context from the browser. In other words you shouldn't be able to access the token from the browser.

The library we use for this is [`@axa-fr/oidc-client`](https://github.com/AxaFrance/oidc-client).

### iFrame rendering

Rendered Markdown, such as data from GitLab issues, are only served from the `srcdoc` of a [sandboxed iframe](src/elements/secure-iframe/secure-iframe.ts).

## TODO

- [ ] Security Audit
- [ ] Cypress
- [ ] Unit Tests
- [ ] PWA
- [ ] Production
- [ ] RocketChat API
