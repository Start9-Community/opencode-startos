# Updating the upstream version

The package wraps a single upstream source: the published OpenCode container
image, `ghcr.io/anomalyco/opencode`. The package builds a thin image on top of it
(`./Dockerfile`), so the pin lives in that Dockerfile's `FROM` line rather than in
a `dockerTag` field in `startos/manifest/index.ts` — the manifest only says
`source: { dockerBuild: {} }`.

## Determining the upstream version

The image tag tracks the upstream GitHub release version exactly: the release tag
`v2.4.1` is published as image tag `2.4.1`, with no leading `v` and no
major/minor alias (`2.4` does not exist). A moving `latest` tag also exists; do
not pin to it.

List the releases and take the newest `v2.x` tag:

```bash
curl -s 'https://api.github.com/repos/anomalyco/opencode/releases?per_page=15' \
  | jq -r '[.[] | select(.prerelease == false) | .tag_name] | .[]'
```

Do not use `.../releases/latest`: this repository marks the current `v2.x` line as
newer than what that endpoint returns, so it still reports the `v1.19.x` series.
Upstream's `<https://opencode.ai>` site also names the current version.

The package targets `x86_64` and `aarch64`; confirm the new tag publishes both
before bumping:

```bash
docker manifest inspect ghcr.io/anomalyco/opencode:<version> | jq '.manifests[].platform'
```

## Applying the bump

1. Edit the `FROM` line in `./Dockerfile` to the new tag:

   ```dockerfile
   FROM ghcr.io/anomalyco/opencode:<version>
   ```

2. Bump the package version in `startos/versions/current.ts` to match, and add
   release notes — see the Versions page of the packaging guide
   (<https://docs.start9.com/packaging/versions.html>) for that procedure.

3. Re-verify on a StartOS box: the service starts, the web interface loads and
   accepts the password, and the packages OpenCode shells out to (`git`, `bash`)
   are still present in the upstream image — the Dockerfile's added packages are
   the only reason OpenCode's repository and terminal features work.

There are no patches or other pins to carry: the Dockerfile adds packages only and
modifies nothing upstream ships.
