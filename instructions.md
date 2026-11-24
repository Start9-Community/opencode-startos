# OpenCode

## Documentation

- [Web interface](https://opencode.ai/docs/cli/web/) ([markdown](https://opencode.ai/docs/cli/web.md)) — the browser interface, the server address and password, and how to reach the server.
- [Providers](https://opencode.ai/docs/providers/) ([markdown](https://opencode.ai/docs/providers.md)) — connecting the model provider you want OpenCode to use.
- [Configuration](https://opencode.ai/docs/config/) ([markdown](https://opencode.ai/docs/config.md)) — the OpenCode configuration file and its options.
- [Agents](https://opencode.ai/docs/agents/) ([markdown](https://opencode.ai/docs/agents.md)) — the built-in agents and how to add your own.

## What you get on StartOS

This package runs the OpenCode server and its web interface as a service on your
StartOS server. You use it from a browser:

- It exposes one **Web Interface** that serves both the OpenCode web app and its
  HTTP API.
- Everything OpenCode keeps — sessions, provider credentials, cloned
  repositories, and the projects you open — is stored on your server, in the
  service's data volume, and is included in backups.
- The web interface is protected by a password the package generates for you.
  There is no default password and none is written into any documentation.

## Getting set up

1. On install, the service shows a task: **Set the admin password before signing
   in**. Run the **Set Admin Password** action and copy the password it returns.
   The username is always `opencode`.
2. Open the **Web Interface** from the service's Interfaces tab (enable an
   address there if none is enabled yet).
3. On the **Connect to a server** screen, click **Use password**. The server
   address is already filled in — leave it as it is — paste the password, and
   click **Connect**.
4. In the web app, open **Settings → Providers** and connect a model provider
   (an API key, or your OpenCode Console account). OpenCode can't do anything
   until it has a model to use.
5. Back on the home screen, click **Add project** and choose a folder to work in.
   Pick a folder inside your home directory (`~/…`, shown as `root` when you
   browse from `/`) — that is where your server keeps data across restarts.
   Anything outside it is lost when the service restarts.

## Using OpenCode

The web app is the whole interface: start a session, point it at a project, and
chat with the agent. The agent edits files, runs commands, and uses tools in the
project folder you opened.

### The web interface

Open the **Web Interface** address in any browser on your network and sign in.
Once signed in, a browser remembers the connection; you can add more projects,
open past sessions, and change settings from the sidebar. The same address also
serves the HTTP API under `/api/*`, if you want to drive the server from your own
scripts.

### Changing the password

Run **Set Admin Password** again at any time to generate a new password. The
service restarts with it, and any browser already signed in has to sign in again
with the new one.

### Backups

The service's data volume, and the generated password, are included in StartOS
backups. A restore brings your sessions, projects, provider credentials, and
login password back as they were.

## Limitations

- **Sign-in uses the password, not a pairing link.** Upstream's `opencode pair`
  command, which prints a one-time link and QR code, is not exposed here; use the
  password from the **Set Admin Password** action instead.
- **The server does not update itself.** OpenCode's in-app update check is turned
  off; update the service by updating this package in StartOS.

### If you publish the interface through a tunnel

OpenCode opens its own connections out — to the model provider you configure and
to any git repository it clones or fetches. If you publish the web interface
through a tunnel to keep your home IP private, send the service's outbound
traffic through that tunnel too, or those providers and git hosts will see your
home IP address even though your browser sessions do not.
