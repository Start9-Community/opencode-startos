import { IMPOSSIBLE, VersionInfo } from '@start9labs/start-sdk'

export const current = VersionInfo.of({
  version: '2.4.1:2',
  releaseNotes: {
    en_US:
      "Initial release of OpenCode for StartOS. Use models served by Ollama, vLLM, or llama.cpp on the same server with the Connect Local Models action, add any other OpenAI-compatible endpoint with Configure Model Providers, and trust a private provider's certificate authority with Configure Provider CA.",
    es_ES:
      'Primera versión de OpenCode para StartOS. Usa modelos servidos por Ollama, vLLM o llama.cpp en el mismo servidor con la acción Conectar modelos locales, añade cualquier otro endpoint compatible con OpenAI con Configurar proveedores de modelos y confía en la autoridad de certificación de un proveedor privado con Configurar CA del proveedor.',
    de_DE:
      'Erstveröffentlichung von OpenCode für StartOS. Nutzen Sie Modelle von Ollama, vLLM oder llama.cpp auf demselben Server mit der Aktion „Lokale Modelle verbinden“, fügen Sie mit „Modellanbieter konfigurieren“ jeden anderen OpenAI-kompatiblen Endpunkt hinzu und vertrauen Sie mit „Anbieter-CA konfigurieren“ der Zertifizierungsstelle eines privaten Anbieters.',
    pl_PL:
      'Pierwsze wydanie OpenCode dla StartOS. Korzystaj z modeli udostępnianych przez Ollama, vLLM lub llama.cpp na tym samym serwerze dzięki akcji Połącz modele lokalne, dodawaj dowolny inny punkt końcowy zgodny z OpenAI akcją Konfiguruj dostawców modeli i zaufaj urzędowi certyfikacji prywatnego dostawcy akcją Konfiguracja CA dostawcy.',
    fr_FR:
      'Première version d’OpenCode pour StartOS. Utilisez les modèles servis par Ollama, vLLM ou llama.cpp sur le même serveur avec l’action Connecter des modèles locaux, ajoutez tout autre point d’accès compatible OpenAI avec Configurer les fournisseurs de modèles, et faites confiance à l’autorité de certification d’un fournisseur privé avec Configurer l’autorité de certification.',
  },
  migrations: {
    up: async ({ effects }) => {},
    down: IMPOSSIBLE,
  },
})
