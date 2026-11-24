import { setupManifest } from '@start9labs/start-sdk'
import { long, short } from './i18n'

export const manifest = setupManifest({
  id: 'opencode',
  title: 'OpenCode',
  license: 'MIT',
  packageRepo: 'https://github.com/jonbotx/opencode-startos',
  upstreamRepo: 'https://github.com/anomalyco/opencode',
  marketingUrl: 'https://opencode.ai',
  donationUrl: null,
  description: { short, long },
  // `main` is the container's home directory (sessions, credentials,
  // repositories and projects); `startos` holds the generated login password
  // and is never mounted into the container.
  volumes: ['main', 'startos'],
  images: {
    // Built from ./Dockerfile: the upstream image plus the git and bash the
    // Alpine base omits (see the Dockerfile for why).
    opencode: {
      source: { dockerBuild: {} },
      arch: ['x86_64', 'aarch64'],
    },
  },
})
