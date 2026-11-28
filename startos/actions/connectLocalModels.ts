import { storeJson } from '../fileModels/store.json'
import { i18n } from '../i18n'
import { localBackends } from '../localModels'
import { sdk } from '../sdk'

const { InputSpec, Value } = sdk

export const connectLocalModels = sdk.Action.withInput(
  // id
  'connect-local-models',

  // metadata
  {
    name: i18n('Connect Local Models'),
    description: i18n(
      'Connect OpenCode to the Ollama, vLLM, or llama.cpp service on this server, so their models appear in OpenCode.',
    ),
    warning: null,
    allowedStatuses: 'any',
    group: null,
    visibility: 'enabled',
  },

  // input spec
  InputSpec.of({
    backends: Value.dynamicMultiselect(async ({ effects, prefill }) => {
      const installed = await effects.getInstalledPackages()
      const values = Object.fromEntries(
        localBackends
          .filter((b) => installed.includes(b.id))
          .map((b) => [b.id, b.title]),
      )
      const prior = (prefill as { backends?: string[] } | null)?.backends ?? []
      return {
        name: i18n('Services'),
        description: i18n(
          'The model services installed on this server. Checking one connects it; unchecking it disconnects it.',
        ),
        values,
        default: prior.filter((id) => id in values),
      }
    }),
  }),

  // prefill
  async ({ effects }) => ({
    backends: (await storeJson.read((s) => s.localBackends).once()) ?? [],
  }),

  // execution
  async ({ effects, input }) => {
    await storeJson.merge(effects, { localBackends: input.backends })
    return {
      version: '1',
      title: i18n('Connect Local Models'),
      message: i18n(
        'Saved. OpenCode restarts, and the connected services’ models appear in its model list once each service is running.',
      ),
      result: null,
    }
  },
)
