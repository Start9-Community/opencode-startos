import { storeJson } from './fileModels/store.json'
import { bridgeAddress, localBackends } from './localModels'
import { sdk } from './sdk'

const dependency = (backend: (typeof localBackends)[number]) => {
  const { id, title, icon, versionRange } = backend
  return sdk.Dependency.optional(id, {
    description: {
      en_US: `Optional: serve local models to OpenCode through ${title}. Connect it with the Connect Local Models action.`,
      es_ES: `Opcional: sirve modelos locales a OpenCode mediante ${title}. Conéctalo con la acción Conectar modelos locales.`,
      de_DE: `Optional: lokale Modelle über ${title} für OpenCode bereitstellen. Mit der Aktion „Lokale Modelle verbinden“ verbinden.`,
      pl_PL: `Opcjonalnie: udostępniaj OpenCode lokalne modele przez ${title}. Połącz akcją Połącz modele lokalne.`,
      fr_FR: `Optionnel : servez des modèles locaux à OpenCode via ${title}. Connectez-le avec l’action Connecter des modèles locaux.`,
    },
    metadata: { title, icon },
    versionRange,
    kind: 'running',
    healthChecks: ['primary'],
    // Connected and installed: an uninstalled backend resolves no address.
    enabled: async ({ effects }) =>
      (
        (await storeJson.read((s) => s.localBackends).const(effects)) ?? []
      ).includes(id) && (await bridgeAddress(effects, backend)) !== null,
  })
}

export const dependencies = sdk.Dependencies.of()
  .addDependency(dependency(localBackends[0]))
  .addDependency(dependency(localBackends[1]))
  .addDependency(dependency(localBackends[2]))
