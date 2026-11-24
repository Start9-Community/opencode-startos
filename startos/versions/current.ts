import { IMPOSSIBLE, VersionInfo } from '@start9labs/start-sdk'

export const current = VersionInfo.of({
  version: '2.4.1:0',
  releaseNotes: {
    en_US: 'Initial release of the OpenCode package for StartOS.',
    es_ES: 'Lanzamiento inicial del paquete OpenCode para StartOS.',
    de_DE: 'Erstveröffentlichung des OpenCode-Pakets für StartOS.',
    pl_PL: 'Pierwsze wydanie pakietu OpenCode dla StartOS.',
    fr_FR: 'Version initiale du paquet OpenCode pour StartOS.',
  },
  migrations: {
    up: async ({ effects }) => {},
    down: IMPOSSIBLE,
  },
})
