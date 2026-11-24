import { storeJson } from './fileModels/store.json'
import { i18n } from './i18n'
import { sdk } from './sdk'
import { uiPort } from './utils'

export const main = sdk.setupMain(async ({ effects }) => {
  const adminPassword = await storeJson
    .read((s) => s.adminPassword)
    .const(effects)

  if (!adminPassword) {
    throw new Error('The admin password has not been set')
  }

  return sdk.Daemons.of(effects).addDaemon('opencode', {
    subcontainer: sdk.SubContainer.of(
      effects,
      { imageId: 'opencode' },
      sdk.Mounts.of().mountVolume({
        volumeId: 'main',
        subpath: null,
        mountpoint: '/root',
        readonly: false,
      }),
      'opencode-sub',
    ),
    exec: {
      command: sdk.useEntrypoint([
        'serve',
        '--hostname',
        '0.0.0.0',
        '--port',
        String(uiPort),
      ]),
      env: {
        OPENCODE_PASSWORD: adminPassword,
        OPENCODE_DISABLE_AUTOUPDATE: '1',
      },
    },
    ready: {
      display: i18n('Web Interface'),
      fn: () =>
        sdk.healthCheck.checkPortListening(effects, uiPort, {
          successMessage: i18n('The web interface is ready'),
          errorMessage: i18n('The web interface is not ready'),
        }),
    },
    requires: [],
  })
})
