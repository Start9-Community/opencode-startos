# AGENTS.md

This is a StartOS service-package repository — it builds a `.s9pk` for StartOS.

Develop it inside a StartOS packaging workspace created by `start-cli s9pk init-workspace`,
which provides the packaging guide and agent context one level up. If you're reading this in a
bare clone with no workspace, the full guide is at <https://docs.start9.com/packaging>.

## This package

- **Keep `git`, `bash`, and `openssh-client` in the Dockerfile.** The upstream Alpine
  image ships none of them, and OpenCode's repository and terminal features break
  silently without them.
- **Deliver the password and provider API keys only through the environment.** OpenCode
  reads the password from `OPENCODE_PASSWORD` and each provider key from
  `OPENCODE_KEY_<ID>`; don't write either into a config file.
- **Keep `main` mounted over the whole of `/root`.** OpenCode spreads its state across
  `~/.local`, `~/.config` and `~/.cache`, and users keep projects under `~`; a narrower
  mount drops data from restarts and backups.
- **The Configure Model Providers action owns only the providers it writes.** They are
  the `opencode.json` entries carrying `package: @opencode/ai/providers/openai-compatible`;
  rebuild those from the form, and leave every other entry — and a `model` that names
  none of them — as you found it.
