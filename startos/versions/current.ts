import { IMPOSSIBLE, VersionInfo } from '@start9labs/start-sdk'

export const current = VersionInfo.of({
  version: '2.4.1:2',
  releaseNotes: {
    en_US:
      'Add private provider CA trust and keep existing model aliases when configuring providers.',
    es_ES:
      'Permite confiar en una CA privada y conserva los alias de modelos al configurar proveedores.',
    de_DE:
      'Unterstützt private Zertifizierungsstellen und behält vorhandene Modellaliase beim Konfigurieren der Anbieter bei.',
    pl_PL:
      'Dodaje obsługę prywatnego CA i zachowuje istniejące aliasy modeli podczas konfigurowania dostawców.',
    fr_FR:
      'Ajoute la prise en charge des AC privées et conserve les alias de modèles lors de la configuration des fournisseurs.',
  },
  migrations: {
    up: async ({ effects }) => {},
    down: IMPOSSIBLE,
  },
})
