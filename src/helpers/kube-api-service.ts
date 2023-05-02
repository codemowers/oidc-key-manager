import {CoreV1Api, KubeConfig} from '@kubernetes/client-node'
import {CommonFlagsInterface, ConfigType} from './common-flags'
import {Command} from '@oclif/core'
import {Secret} from './secret'

const Undefined = 'undefined'

export class KubeApiService {
  private kc: KubeConfig
  private coreV1Api: CoreV1Api
  private namespace: string
  private command: Command
  private secretName: any

  constructor(command: Command, flags: CommonFlagsInterface) {
    this.command = command
    this.kc = new KubeConfig()
    flags.config === ConfigType.InCluster ? this.kc.loadFromCluster() : this.kc.loadFromDefault()
    this.namespace = flags.namespace ?? this.kc.getContextObject(this.kc.getCurrentContext())?.namespace ?? Undefined
    this.coreV1Api = this.kc.makeApiClient(CoreV1Api)
    this.secretName = flags.secret
    this.#validate()
  }

  #validate(): void {
    if (this.namespace === Undefined) {
      this.command.error(
        'namespace is undefined',
        {
          suggestions: [
            'set namespace with -n',
            'configure service account for this deployment/job',
          ],
        })
    }
  }

  printConfiguration(): void {
    this.command.log('Using Kubernetes parameters:', {
      ...this.kc.getContextObject(this.kc.getCurrentContext()),
      server: this.kc.getCurrentCluster()?.server,
      secretName: this.secretName,
    })
  }

  async checkSecretExistence(): Promise<boolean> {
    this.command.log(`Checking if secret ${this.secretName} exists`)
    const exists = await this.coreV1Api.readNamespacedSecret(this.secretName, this.namespace)
    .then(() => true)
    .catch(error => {
      if (error.status === 404) {
        return false
      }
    })
    this.command.log(exists ? `Secret ${this.secretName} already exists` : `Secret ${this.secretName} does not exist`)
    return Boolean(exists)
  }

  async deleteSecret(): Promise<void> {
    this.command.log(`Deleting existing secret ${this.secretName}`)
    await this.coreV1Api.deleteNamespacedSecret(this.secretName, this.namespace).then(() => true)
    this.command.log(`Existing secret ${this.secretName} deleted`)
  }

  async createSecret(secret: Secret): Promise<void> {
    this.command.log(`Creating secret ${this.secretName}`)
    await this.coreV1Api.createNamespacedSecret(this.namespace, secret.toKubeSecret(this.secretName))
    this.command.log(`Created secret ${this.secretName}`)
  }
}
