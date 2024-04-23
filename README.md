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

[TODO: nginx config recommendations]

## Development

### HTTPS Certificates

The dev server needs to run with `https`. This is because we use the [`window.crypto.subtle`](https://developer.mozilla.org/en-US/docs/Web/API/Crypto/subtle) library, which is only available in secure contexts.

You can use a tool such as [`mkcert`](https://github.com/FiloSottile/mkcert), or perform the steps manually.

See the convenience script [`.internal/certs/generate-certificates.sh`](.internal/certs/generate-certificates.sh) for the manual steps on Linux.

The domain name / common name must be `ros-dashboard.test`. This is because the domain is registered as an OIDC application in the Identity Provider as well as GitLab

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

Then start the development server.

```sh
npm run dev
```

Login to the Identity Provider in your browser.

Then access the app at: <https://ros-dashboard.test:3443>

## Docker

You can use `Docker` to run and build the project, without installing `NodeJS` on your local machine.

See or run the convenience scripts in `.internal/docker/`.

### Install

[`.internal/docker/npm-install.sh`](/.internal/docker/npm-install.sh)

```sh
sh ./.internal/docker/npm-install.sh
```

### Run Development Server

[`.internal/docker/npm-dev.sh`](/.internal/docker/npm-dev.sh)

```sh
sh ./.internal/docker/npm-dev.sh
```

### Build

[`.internal/docker/npm-build.sh`](/.internal/docker/npm-build.sh)

```sh
sh .internal/docker/npm-build.sh
```

### CLI

[`.internal/docker/npm-build.sh`](/.internal/docker/npm-build.sh)

```sh
sh .internal/docker/npm-cli.sh
```

## Security

### Content Security Policies

Additionally Information Disclosure from within the Dashboard are mitigated by limiting the Content-Security-Policy header to only trusted origins.

[TODO: more info]

### OAuth Service Worker

[TODO: INFO]

### iFrame rendering

Rendered Markdown, such as data from GitLab issues, are only served from the srcdoc of a [sandboxed iframe](elements/ui/unsafe-content.js).

[TODO: Copy over + elaborate]

## TODO

- [x] Lit + Vite + Router
- [x] GitLab Auth
- [ ] State management: signals? pojo? localStorage? redux?
- [ ] Jest
- [ ] Eslint
- [ ] Pretty quick
- [ ] Lint staged
- [ ] Commit hooks
- [ ] History pushState
- [ ] CSS Library
- [ ] App layout
- [ ] Features
  - [ ] Top bar
  - [ ] Sidebar
  - [ ] Homepage
  - [ ] Project detail
  - [ ] Project new
- [ ] CI/CD
- [ ] Meta tags
- [ ] Disable EyeDP Auth in prod builds
- [ ] Documentation
  - [ ] SSL
  - [ ] Security
  - [ ] Proxy config
- [ ] Staging
- [ ] Security Audit
- [ ] Cypress
- [ ] Production
