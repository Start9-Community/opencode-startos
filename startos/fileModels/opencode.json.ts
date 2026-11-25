import { FileHelper, z } from '@start9labs/start-sdk'
import { sdk } from '../sdk'

// OpenCode's global configuration. The Configure Model Providers action adds
// providers here; `providers` and `model` stay unvalidated because the action owns
// `providers`, and `model` is a string or the object OpenCode resolves it to.
const shape = z.looseObject({
  $schema: z.string().optional().catch(undefined),
  model: z.unknown().optional().catch(undefined),
  providers: z.record(z.string(), z.unknown()).optional().catch(undefined),
})

export const opencodeJson = FileHelper.json(
  { base: sdk.volumes.main, subpath: '.config/opencode/opencode.json' },
  shape,
)

export type OpencodeProvider = {
  name?: unknown
  package?: unknown
  settings?: unknown
  models?: unknown
}

export type OpencodeConfig = z.infer<typeof shape>
