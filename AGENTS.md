# AGENTS.md

This is a StartOS service-package repository — it builds a `.s9pk` for StartOS.

Develop it inside a StartOS packaging workspace created by `start-cli s9pk init-workspace`,
which provides the packaging guide and agent context one level up. If you're reading this in a
bare clone with no workspace, the full guide is at <https://docs.start9.com/packaging>.

## This package

- **Keep `git`, `bash`, and `openssh-client` in the Dockerfile.** The upstream Alpine
  image ships none of them, and OpenCode's repository and terminal features break
  silently without them.
- **Deliver the password only through `OPENCODE_PASSWORD`.** Don't write it into
  OpenCode's own config file; the server reads it from the environment alone.
- **Keep `main` mounted over the whole of `/root`.** OpenCode spreads its state across
  `~/.local`, `~/.config` and `~/.cache`, and users keep projects under `~`; a narrower
  mount drops data from restarts and backups.
