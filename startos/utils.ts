// The internal port the OpenCode server binds and that the `ui` interface is
// exported on. Kept in one place so startos/main.ts (which launches it and
// health-checks it) and startos/interfaces.ts (which exposes it) cannot drift.
export const uiPort = 4096
