import { FileHelper, z } from '@start9labs/start-sdk'
import { parse, type ParseError } from 'jsonc-parser'
import { i18n } from '../i18n'
import { sdk } from '../sdk'

const shape = z.looseObject({
  $schema: z.string().optional().catch(undefined),
  model: z.unknown().optional().catch(undefined),
  providers: z.record(z.string(), z.unknown()).optional().catch(undefined),
})

// OpenCode accepts comments and trailing commas in `opencode.json`.
export const opencodeJson = FileHelper.raw(
  { base: sdk.volumes.main, subpath: '.config/opencode/opencode.json' },
  (config: OpencodeConfig) => JSON.stringify(config, null, 2),
  (text) => {
    const errors: ParseError[] = []
    const config: unknown = parse(text, errors, { allowTrailingComma: true })
    if (errors.length) {
      throw new Error(
        i18n(
          'The OpenCode configuration contains invalid JSONC. Fix opencode.json before configuring providers.',
        ),
      )
    }
    return config
  },
  (config) => shape.parse(config),
)

export type OpencodeProvider = {
  name?: unknown
  package?: unknown
  settings?: unknown
  models?: unknown
}

export type OpencodeConfig = z.infer<typeof shape>
