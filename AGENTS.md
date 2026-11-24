# AGENTS.md

This is a StartOS service-package repository — it builds a `.s9pk` for StartOS.

Develop it inside a StartOS packaging workspace created by `start-cli s9pk init-workspace`,
which provides the packaging guide and agent context one level up. If you're reading this in a
bare clone with no workspace, the full guide is at <https://docs.start9.com/packaging>.

## This package

- **The base image is pinned in `./Dockerfile`, not in the manifest.** The manifest
  sets `source: { dockerBuild: {} }` because the package builds a thin image on top of
  upstream's; the `FROM` line is the pin. See `UPDATING.md` for the bump recipe.
- **The Dockerfile's added packages are load-bearing.** The upstream image is a slim
  Alpine base with neither `git` nor `bash`; OpenCode shells out to both (repositories,
  diffs, worktrees, its terminal tool). Removing `git`, `bash`, or `openssh-client`
  silently breaks those features.
- **The interface port is defined once, in `startos/utils.ts`.** `startos/main.ts`
  passes it to `opencode serve` and health-checks it, and `startos/interfaces.ts`
  binds it. If the port ever changes, all three must change together.
- **The password is delivered only through the environment.** OpenCode reads
  `OPENCODE_PASSWORD`, with the username fixed at `opencode`; it cannot be handed a
  password hash in a config file. `startos/fileModels/store.json.ts` holds the value
  on the `startos` volume, which no subcontainer mounts. Do not "improve" this by
  writing OpenCode's own config file.
- **`startos/main.ts` mounts the `main` volume over the container's entire home**
  (`/root`), which is where OpenCode keeps sessions, provider credentials, cloned
  repositories, and projects. Narrowing the mountpoint drops user data from backups.

## Working here

```bash
npx tsc --noEmit   # fast type check
make format        # Prettier, using the SDK's shared config
make x86           # build opencode_x86_64.s9pk (and `make arm` for aarch64)
```

A green type-check proves nothing about the service; install the `.s9pk` on a StartOS
box and exercise it. See the packaging guide's Development Workflow page.
