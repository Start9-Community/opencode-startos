import { normalizeProviderCa, providerCa } from '../fileModels/providerCa'
import { i18n } from '../i18n'
import { sdk } from '../sdk'

export const configureProviderCa = sdk.Action.withInput(
  'configure-provider-ca',
  {
    name: i18n('Configure Provider CA'),
    description: i18n(
      'Trust one additional CA for outbound OpenCode HTTPS connections.',
    ),
    warning: null,
    allowedStatuses: 'any',
    group: null,
    visibility: 'enabled',
  },
  sdk.InputSpec.of({
    pem: sdk.Value.textarea({
      name: i18n('Public CA certificate (PEM)'),
      description: i18n(
        'Paste one certificate. Clear the field to remove trust.',
      ),
      default: null,
      required: false,
      maxLength: 32768,
    }),
  }),
  async () => ({ pem: (await providerCa.read().once()) || null }),
  async ({ effects, input }) => {
    const pem = normalizeProviderCa(input.pem ?? '')
    await providerCa.update(effects, () => pem)
    return {
      version: '1',
      title: i18n('Configure Provider CA'),
      message: i18n('Trust settings saved.'),
      result: null,
    }
  },
)
