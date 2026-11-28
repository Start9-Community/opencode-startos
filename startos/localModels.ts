import * as fs from 'node:fs/promises'
import { FileHelper, T, z } from '@start9labs/start-sdk'
import {
  apiKeyHostId as llamaCppHostId,
  apiPort as llamaCppPort,
} from 'llama-cpp-startos/startos/utils'
import {
  apiHostId as ollamaHostId,
  port as ollamaPort,
} from 'ollama-startos/startos/utils'
import {
  apiHostId as vllmHostId,
  apiPort as vllmPort,
} from 'vllm-startos/startos/utils'
import { sdk } from './sdk'
import { openAiCompatiblePackage } from './utils'

type Credentials = { apiKey?: string; model?: string }

type LocalBackend = {
  id: string
  title: string
  icon: string
  hostId: string
  internalPort: number
  versionRange: string
  // Whether the backend publishes `credentials.json` on its `public` volume.
  publishesCredentials: boolean
  // OpenCode's `providers.<id>` entry, or `null` while it can't be served yet.
  provider: (baseURL: string, credentials: Credentials) => object | null
}

export const localBackends = [
  {
    id: 'ollama',
    icon: 'https://raw.githubusercontent.com/Start9Labs/ollama-startos/master/icon.svg',
    title: 'Ollama',
    hostId: ollamaHostId,
    internalPort: ollamaPort,
    versionRange: '>=0.31.2:2',
    publishesCredentials: false,
    // OpenCode's built-in Ollama provider discovers the models itself.
    provider: (baseURL) => ({ settings: { baseURL } }),
  },
  {
    id: 'vllm',
    icon: 'https://raw.githubusercontent.com/Start9Labs/vllm-startos/master/icon.svg',
    title: 'vLLM',
    hostId: vllmHostId,
    internalPort: vllmPort,
    // First release publishing the served model name.
    versionRange: '>=0.33.0:1',
    publishesCredentials: true,
    provider: (baseURL, { apiKey, model }) =>
      apiKey && model
        ? {
            name: 'vLLM',
            package: openAiCompatiblePackage,
            settings: { baseURL, apiKey },
            // OpenCode's built-in vLLM provider marks discovered models
            // tool-less; every vLLM preset serves with a tool-call parser.
            models: { [model]: { name: model, capabilities: { tools: true } } },
          }
        : null,
  },
  {
    id: 'llama-cpp',
    icon: 'https://raw.githubusercontent.com/Start9Labs/llama-cpp-startos/master/icon.png',
    title: 'llama.cpp',
    hostId: llamaCppHostId,
    internalPort: llamaCppPort,
    // First release with the Bearer-gated API host and a published key.
    versionRange: '>=11960:1',
    publishesCredentials: true,
    // llama-server serves one model and answers whatever model name it is sent.
    provider: (baseURL, { apiKey }) =>
      apiKey
        ? {
            name: 'llama.cpp',
            package: openAiCompatiblePackage,
            settings: { baseURL, apiKey },
            models: { [llamaCppModelId]: { name: 'llama.cpp' } },
          }
        : null,
  },
] as const satisfies readonly LocalBackend[]

export const llamaCppModelId = 'current'

export type LocalBackendId = (typeof localBackends)[number]['id']

export const localBackendIds: readonly string[] = localBackends.map((b) => b.id)

const credentialsFile = (id: string) =>
  FileHelper.json(
    `${sdk.volumes.mounts.subpath(id)}/credentials.json`,
    z.looseObject({
      apiKey: z.string().optional().catch(undefined),
      model: z.string().optional().catch(undefined),
    }),
  )

// The bridge address each backend's `public` volume was mounted for.
const mountedFor = new Map<string, string>()

async function readCredentials(
  effects: T.Effects,
  id: string,
  bridgeAddress: string | null,
): Promise<Credentials> {
  const hasPublicVolume = await sdk
    .getServiceManifest(
      effects,
      id,
      (m) => m?.volumes.includes('public') ?? false,
    )
    .const()
  if (!bridgeAddress || !hasPublicVolume) {
    mountedFor.delete(id)
    return {}
  }
  try {
    if (mountedFor.get(id) !== bridgeAddress) {
      const location = sdk.volumes.mounts.subpath(id)
      await fs.mkdir(location, { recursive: true })
      await sdk.mount(effects, {
        location,
        target: {
          packageId: id,
          volumeId: 'public',
          subpath: null,
          readonly: true,
          idmap: [],
        },
      })
      mountedFor.set(id, bridgeAddress)
    }
    return (await credentialsFile(id).read().const(effects)) ?? {}
  } catch {
    return {}
  }
}

export const bridgeAddress = (
  effects: T.Effects,
  b: (typeof localBackends)[number],
) =>
  sdk.host
    .getBridgeAddress(effects, {
      packageId: b.id,
      hostId: b.hostId,
      internalPort: b.internalPort,
      ssl: false,
    })
    .const()

// OpenCode `providers` entries for the connected backends that can be served now.
export async function localProviders(
  effects: T.Effects,
  connected: readonly string[],
): Promise<Record<string, object>> {
  const providers: Record<string, object> = {}
  for (const b of localBackends) {
    if (!connected.includes(b.id)) continue
    const address = await bridgeAddress(effects, b)
    const credentials = b.publishesCredentials
      ? await readCredentials(effects, b.id, address)
      : {}
    if (!address) continue
    const provider = b.provider(`http://${address}/v1`, credentials)
    if (provider) providers[b.id] = provider
  }
  return providers
}
