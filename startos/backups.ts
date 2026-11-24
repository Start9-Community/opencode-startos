import { sdk } from './sdk'

export const { createBackup, restoreInit } = sdk.setupBackups(
  // `main` (the container's home: sessions, credentials, repositories and
  // projects) plus `startos` (the generated login password). Restoring the data
  // without the password would leave the service locked behind a lost credential.
  async ({ effects }) => sdk.Backups.ofVolumes('main', 'startos'),
)
