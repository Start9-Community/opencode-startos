import { FileHelper, z } from '@start9labs/start-sdk'
import { sdk } from '../sdk'

const shape = z.looseObject({
  adminPassword: z.string().optional().catch(undefined),
  // API keys for the providers the Configure Model Providers action writes, keyed
  // by provider id; `main.ts` passes each to the server as `OPENCODE_KEY_<ID>`.
  providerKeys: z.record(z.string(), z.unknown()).optional().catch(undefined),
})

export const storeJson = FileHelper.json(
  { base: sdk.volumes.startos, subpath: 'store.json' },
  shape,
)
