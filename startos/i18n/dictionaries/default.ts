export const DEFAULT_LANG = 'en_US'

const dict = {
  // main.ts
  'Web Interface': 0,
  'The web interface is ready': 1,
  'The web interface is not ready': 2,

  // interfaces.ts
  'The OpenCode web interface and HTTP API': 3,

  // actions/setAdminPassword.ts
  'Set Admin Password': 4,
  'Generate a new random password for the OpenCode web interface. Replaces any existing password.': 5,
  'Replaces the current admin password.': 6,
  'Login Credentials': 7,
  'Use these credentials to sign in to the web interface.': 8,
  Username: 9,
  Password: 10,

  // init/watchCredentials.ts
  'Set the admin password before signing in': 11,

  // actions/configureProviders.ts
  'Configure Model Providers': 12,
  'Connect the OpenAI-compatible model providers OpenCode can use — your own vLLM, LM Studio, or Ollama server, or a hosted API.': 13,
  Providers: 14,
  'One entry per endpoint. Remove an entry to disconnect that provider.': 15,
  ID: 16,
  'A short identifier for this provider, used to select it. Lowercase letters, digits, and dashes, for example `lab`.': 17,
  'Lowercase letters, digits, and dashes, starting with a letter or digit': 18,
  Name: 19,
  'How the provider is named in the OpenCode model list, for example `Lab vLLM`.': 20,
  'Base URL': 21,
  'The OpenAI-compatible API base URL, including `/v1`, for example `http://192.168.1.50:8000/v1`.': 22,
  'Must start with http:// or https://': 23,
  'API Key': 24,
  'Only if the endpoint checks it. Leave blank for a local server that accepts any request.': 25,
  Models: 26,
  'One entry per model ID the endpoint serves, for example `glm-5.3`. The endpoint lists them under `/v1/models`.': 27,
  'Model ID': 28,
  Default: 29,
  'Use the first model listed above for new sessions.': 30,
  'Model Providers': 31,
  'Saved. These providers are available in OpenCode, and new sessions start on the default model if one is set.': 32,
  'Default Model': 33,
  'Provider ID "${id}" belongs to a provider configured outside this action. Choose another ID.': 34,
  'The OpenCode configuration contains invalid JSONC. Fix opencode.json before configuring providers.': 35,
  'Configure Provider CA': 36,
  'Trust one additional CA for outbound OpenCode HTTPS connections.': 37,
  'Public CA certificate (PEM)': 38,
  'Paste one certificate. Clear the field to remove trust.': 39,
  'Trust settings saved.': 40,
  'Select only one default provider.': 41,
  'Paste one public PEM CA certificate.': 42,
  'This certificate is not a CA.': 43,
  'Provider ID "${id}" is reserved for the Connect Local Models action. Choose another ID.': 44,
  'Connect Local Models': 45,
  'Connect OpenCode to the Ollama, vLLM, or llama.cpp service on this server, so their models appear in OpenCode.': 46,
  Services: 47,
  'The model services installed on this server. Checking one connects it; unchecking it disconnects it.': 48,
  'Saved. OpenCode restarts, and the connected services’ models appear in its model list once each service is running.': 49,
  'Provider ID "${id}" is already configured in opencode.json. Rename or remove it before connecting this local service.': 50,
} as const

/**
 * Plumbing. DO NOT EDIT.
 */
export type I18nKey = keyof typeof dict
export type LangDict = Record<(typeof dict)[I18nKey], string>
export default dict
