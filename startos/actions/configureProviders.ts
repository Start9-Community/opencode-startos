import { opencodeJson } from '../fileModels/opencode.json'
import { storeJson } from '../fileModels/store.json'
import { i18n } from '../i18n'
import { sdk } from '../sdk'
import { openAiCompatiblePackage, providerKeyEnvVar } from '../utils'

const { InputSpec, List, Value } = sdk

const configSchema = 'https://opencode.ai/config.json'

const asRecord = (value: unknown): Record<string, unknown> =>
  value !== null && typeof value === 'object' && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {}

const asString = (value: unknown): string | undefined =>
  typeof value === 'string' && value !== '' ? value : undefined

// This action owns only the providers it wrote; every one carries this marker.
const isManaged = (provider: Record<string, unknown>): boolean =>
  asString(provider.package) === openAiCompatiblePackage

// `model` is `"provider/model"` in the file, or the object OpenCode resolves it to.
const defaultModelOf = (model: unknown): string | undefined => {
  const direct = asString(model)
  if (direct) return direct
  const { providerID, model: modelID } = asRecord(model)
  const provider = asString(providerID)
  const id = asString(modelID)
  return provider && id ? `${provider}/${id}` : undefined
}

const providerShape = InputSpec.of({
  id: Value.text({
    name: i18n('ID'),
    description: i18n(
      'A short identifier for this provider, used to select it. Lowercase letters, digits, and dashes, for example `vllm`.',
    ),
    required: true,
    default: null,
    maxLength: 48,
    patterns: [
      {
        regex: '^[a-z0-9][a-z0-9-]*$',
        description: i18n(
          'Lowercase letters, digits, and dashes, starting with a letter or digit',
        ),
      },
    ],
  }),
  name: Value.text({
    name: i18n('Name'),
    description: i18n(
      'How the provider is named in the OpenCode model list, for example `Lab vLLM`.',
    ),
    required: true,
    default: null,
    maxLength: 64,
  }),
  baseURL: Value.text({
    name: i18n('Base URL'),
    description: i18n(
      'The OpenAI-compatible API base URL, including `/v1`, for example `http://192.168.1.50:8000/v1`.',
    ),
    required: true,
    default: null,
    patterns: [
      {
        // The SDK anchors a pattern with `^…$` unless both are already present.
        regex: 'https?://.+',
        description: i18n('Must start with http:// or https://'),
      },
    ],
  }),
  apiKey: Value.text({
    name: i18n('API Key'),
    description: i18n(
      'Only if the endpoint checks it. Leave blank for a local server that accepts any request.',
    ),
    required: false,
    default: null,
    masked: true,
  }),
  models: Value.list(
    List.text(
      {
        name: i18n('Models'),
        description: i18n(
          'One entry per model ID the endpoint serves, for example `glm-5.3`. The endpoint lists them under `/v1/models`.',
        ),
        default: [],
        minLength: 1,
        maxLength: null,
      },
      { placeholder: i18n('Model ID') },
    ),
  ),
  isDefault: Value.toggle({
    name: i18n('Default'),
    description: i18n('Use the first model listed above for new sessions.'),
    default: false,
  }),
})

const inputSpec = InputSpec.of({
  providers: Value.list(
    List.obj(
      {
        name: i18n('Providers'),
        description: i18n(
          'One entry per endpoint. Remove an entry to disconnect that provider.',
        ),
        default: [],
        minLength: null,
        maxLength: null,
      },
      {
        spec: providerShape,
        displayAs: 'name',
        uniqueBy: 'id',
      },
    ),
  ),
})

export const configureProviders = sdk.Action.withInput(
  // id
  'configure-providers',

  // metadata
  {
    name: i18n('Configure Model Providers'),
    description: i18n(
      'Connect the OpenAI-compatible model providers OpenCode can use — your own vLLM, LM Studio, or Ollama server, or a hosted API.',
    ),
    warning: null,
    allowedStatuses: 'any',
    group: null,
    visibility: 'enabled',
  },

  // input spec
  inputSpec,

  // prefill: only the providers this action wrote, with their keys read back from
  // the `startos` volume (the config holds a reference to each key, not the key).
  async ({ effects }) => {
    const config = await opencodeJson.read().once()
    const providerKeys = await storeJson.read((s) => s.providerKeys).once()
    const defaultProvider = defaultModelOf(config?.model)?.split('/')[0]

    return {
      providers: Object.entries(config?.providers ?? {})
        .map(([id, value]) => [id, asRecord(value)] as const)
        .filter(([, provider]) => isManaged(provider))
        .map(([id, provider]) => {
          const settings = asRecord(provider.settings)
          return {
            id,
            name: asString(provider.name) ?? id,
            baseURL: asString(settings.baseURL) ?? '',
            apiKey: asString(providerKeys?.[id]) ?? null,
            models: Object.keys(asRecord(provider.models)),
            isDefault: id === defaultProvider,
          }
        }),
    }
  },

  // execution
  async ({ effects, input }) => {
    // The keys go to the `startos` volume first: it triggers the restart that gives
    // the server the new `OPENCODE_KEY_*` variables. `update`, not `merge`, so a key
    // of a provider the user just removed is not left behind in the environment.
    const providerKeys = Object.fromEntries(
      input.providers
        .filter((provider) => provider.apiKey)
        .map((provider) => [provider.id, provider.apiKey]),
    )
    await storeJson.update(effects, (current) => ({
      ...current,
      providerKeys,
    }))

    const marked = input.providers.find((provider) => provider.isDefault)
    let shownModel: string | undefined

    await opencodeJson.update(effects, (current) => {
      const config = current ?? {}
      const existing = asRecord(config.providers)

      // Only the entries this action owns are rebuilt. Every other entry — one the
      // user or OpenCode added — is copied through untouched.
      const providers: Record<string, unknown> = {}
      const managedIds = new Set<string>()
      for (const [id, value] of Object.entries(existing)) {
        const provider = asRecord(value)
        if (isManaged(provider)) managedIds.add(id)
        else providers[id] = value
      }

      for (const provider of input.providers) {
        const previous = asRecord(existing[provider.id])
        const settings = asRecord(previous.settings)
        const previousModels = asRecord(previous.models)

        settings.baseURL = provider.baseURL
        if (provider.apiKey) {
          settings.apiKey = `{env:${providerKeyEnvVar(provider.id)}}`
        } else {
          delete settings.apiKey
        }

        const models: Record<string, unknown> = {}
        for (const modelId of provider.models) {
          models[modelId] = {
            ...asRecord(previousModels[modelId]),
            name: modelId,
            modelID: modelId,
          }
        }

        providers[provider.id] = {
          ...previous,
          name: provider.name,
          package: openAiCompatiblePackage,
          settings,
          models,
        }
      }

      // `model` is left as it was unless this save sets it, or it names a provider
      // this save removes.
      const previousDefault = defaultModelOf(config.model)
      const previousProvider = previousDefault?.split('/')[0]
      shownModel = previousDefault
      let model: unknown = config.model
      if (marked) {
        const next = `${marked.id}/${marked.models[0]}`
        model = next
        shownModel = next
      } else if (
        previousProvider !== undefined &&
        managedIds.has(previousProvider) &&
        !input.providers.some((provider) => provider.id === previousProvider)
      ) {
        model = undefined
        shownModel = undefined
      }

      return {
        ...config,
        $schema: configSchema,
        providers,
        model,
      }
    })

    return {
      version: '1',
      title: i18n('Model Providers'),
      message: i18n(
        'Saved. These providers are available in OpenCode, and new sessions start on the default model if one is set.',
      ),
      result: {
        type: 'group',
        value: [
          ...input.providers.map((provider) => ({
            type: 'single' as const,
            name: provider.name,
            description: provider.id,
            value: provider.models.join(', '),
            masked: false,
            copyable: true,
            qr: false,
            launchable: false,
          })),
          ...(shownModel
            ? [
                {
                  type: 'single' as const,
                  name: i18n('Default Model'),
                  description: null,
                  value: shownModel,
                  masked: false,
                  copyable: true,
                  qr: false,
                  launchable: false,
                },
              ]
            : []),
        ],
      },
    }
  },
)
