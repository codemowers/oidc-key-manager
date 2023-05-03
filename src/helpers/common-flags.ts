import {Flags} from '@oclif/core'
export interface CommonFlagsInterface {
  namespace: string|undefined,
  secret: string,
  config: string
}

export enum ConfigType {
  Local = 'local',
  InCluster = 'cluster',
}

export default {
  namespace: Flags.string({char: 'n', description: 'namespace, defaults to current namespace if service account is used', aliases: ['namespace'], required: false}),
  secret: Flags.string({char: 's', description: 'secret name', aliases: ['secret'], default: 'oidc-keys', required: false}),
  config: Flags.string({char: 'c', description: 'use local or in-cluster Kubernetes config', aliases: ['config'], required: true, options: [ConfigType.Local, ConfigType.InCluster]}),
}
