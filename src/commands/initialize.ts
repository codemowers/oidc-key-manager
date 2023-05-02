import {Command} from '@oclif/core'
import commonFlags from '../helpers/common-flags'
import {KubeApiService} from '../helpers/kube-api-service'
import {Secret} from '../helpers/secret'
export default class Initialize extends Command {
  static description = 'Initialize the secret with initial keys'

  public static enableJsonFlag = true

  static examples = [
    '<%= config.bin %> <%= command.id %>',
    '<%= config.bin %> <%= command.id %>',
    '<%= config.bin %> <%= command.id %> -n <kube namespace> -s <secret name>',
    '<%= config.bin %> <%= command.id %> --namespace <kube namespace> --secret <secret name> --recreate',
  ]

  static flags = {
    ...commonFlags,
  }

  static args = {}

  public async run(): Promise<void> {
    const {flags} = await this.parse(Initialize)
    const kubeApiService = new KubeApiService(this, flags)
    kubeApiService.printConfiguration()

    const exists = await kubeApiService.checkSecretExistence()
    if (exists && !flags.recreate) {
      this.exit(0)
    }

    if (exists) {
      await kubeApiService.deleteSecret()
    }

    const secret = new Secret()
    this.log('Generating secret')
    secret.generateNew()
    await kubeApiService.createSecret(secret)
  }
}
