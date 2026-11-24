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
} as const

/**
 * Plumbing. DO NOT EDIT.
 */
export type I18nKey = keyof typeof dict
export type LangDict = Record<(typeof dict)[I18nKey], string>
export default dict
