oidc-key-manager
=================

CLI to manage secret keys required by oidc-gateway

<!-- toc -->
* [Usage](#usage)
* [Commands](#commands)
<!-- tocstop -->
# Usage
<!-- usage -->
```sh-session
$ npm install -g oidc-key-manager
$ key-manager COMMAND
running command...
$ key-manager (--version)
oidc-key-manager/0.0.0 linux-x64 node-v18.15.0
$ key-manager --help [COMMAND]
USAGE
  $ key-manager COMMAND
...
```
<!-- usagestop -->
# Commands
<!-- commands -->
* [`key-manager initialize`](#key-manager-initialize)

## `key-manager initialize`

Initialize the secret with initial keys

```
USAGE
  $ key-manager initialize [-n <value>] [-s <value>] [--recreate]

FLAGS
  -n, --namespace=<value>  namespace, defaults to current namespace if service account is used
  -s, --secret=<value>     [default: oidc-keys] secret name
  --recreate               recreate the secret if it exists

DESCRIPTION
  Initialize the secret with initial keys

EXAMPLES
  $ key-manager initialize

  $ key-manager initialize -n <kube namespace> -s <secret name>

  $ key-manager initialize --namespace <kube namespace> --secret <secret name> --recreate
```

_See code: [dist/commands/initialize.ts](https://github.com/codemowers/oidc-key-manager/blob/v0.0.0/dist/commands/initialize.ts)_
<!-- commandsstop -->
