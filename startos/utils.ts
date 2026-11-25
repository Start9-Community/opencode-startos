export const uiPort = 4096

// The package OpenCode uses for any OpenAI-compatible endpoint, and the marker the
// Configure Model Providers action uses to recognize the entries it owns.
export const openAiCompatiblePackage =
  '@opencode/ai/providers/openai-compatible'

// The variable a provider's API key reaches the server in, derived from its id
// (restricted to `[a-z0-9-]` by the form, so ids never collide on one variable).
export const providerKeyEnvVar = (providerId: string) =>
  `OPENCODE_KEY_${providerId.toUpperCase().replace(/[^A-Z0-9]/g, '_')}`
