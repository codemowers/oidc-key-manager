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
$ npm install -g @codemowers/oidc-key-manager
$ key-manager COMMAND
running command...
$ key-manager (--version)
@codemowers/oidc-key-manager/0.1.0 linux-x64 node-v16.17.0
$ key-manager --help [COMMAND]
USAGE
  $ key-manager COMMAND
...
```
<!-- usagestop -->
# Commands
<!-- commands -->
* [`key-manager initialize`](#key-manager-initialize)
* [`key-manager rotate`](#key-manager-rotate)

## `key-manager initialize`

Initialize the secret with initial keys

```
USAGE
  $ key-manager initialize -c local|cluster [--json] [-n <value>] [-s <value>] [--recreate]

FLAGS
  -c, --config=<option>    (required) use local or in-cluster Kubernetes config
                           <options: local|cluster>
  -n, --namespace=<value>  namespace, defaults to current namespace if service account is used
  -s, --secret=<value>     [default: oidc-keys] secret name
  --recreate               recreate the secret if it exists

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  Initialize the secret with initial keys

EXAMPLES
  $ key-manager initialize

  $ key-manager initialize

  $ key-manager initialize -n <kube namespace> -s <secret name>

  $ key-manager initialize --namespace <kube namespace> --secret <secret name> --recreate
```

_See code: [dist/commands/initialize.ts](https://github.com/codemowers/oidc-key-manager/blob/v0.1.0/dist/commands/initialize.ts)_

## `key-manager rotate`

Append new JWK|cookie key|both and rotate the array, optionally restarting the deployment

```
USAGE
  $ key-manager rotate -c local|cluster [-n <value>] [-s <value>] [--both] [--jwks] [--cookie-keys]
    [--max-number-of-jwks <value>] [--max-number-of-cookie-keys <value>] [--restart-deployment-backoff <value>
    --restart-deployment <value>]

FLAGS
  -c, --config=<option>                 (required) use local or in-cluster Kubernetes config
                                        <options: local|cluster>
  -n, --namespace=<value>               namespace, defaults to current namespace if service account is used
  -s, --secret=<value>                  [default: oidc-keys] secret name
  --both                                rotate both JWKs and cookie keys
  --cookie-keys                         rotate cookie keys
  --jwks                                rotate JWKs
  --max-number-of-cookie-keys=<value>   [default: 3]
  --max-number-of-jwks=<value>          [default: 3]
  --restart-deployment=<value>          Kubernetes deployment name to restart while rotating
  --restart-deployment-backoff=<value>  [default: 60] Seconds to wait for deployment to restart

DESCRIPTION
  Append new JWK|cookie key|both and rotate the array, optionally restarting the deployment

EXAMPLES
  $ key-manager rotate
```

_See code: [dist/commands/rotate.ts](https://github.com/codemowers/oidc-key-manager/blob/v0.1.0/dist/commands/rotate.ts)_
<!-- commandsstop -->
