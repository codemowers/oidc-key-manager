import {Command, Flags} from '@oclif/core'
import commonFlags from '../helpers/common-flags'
import {KubeApiService} from '../helpers/kube-api-service'
import {Secret} from '../helpers/secret'

export default class Rotate extends Command {
  static description = 'Append new JWK|cookie key|both and rotate the array, optionally restarting the deployment'

  static examples = [
    '<%= config.bin %> <%= command.id %>',
  ]

  static flags = {
    ...commonFlags,
    both: Flags.boolean({description: 'rotate both JWKs and cookie keys', exactlyOne: ['both', 'jwks', 'cookie-keys']}),
    jwks: Flags.boolean({description: 'rotate JWKs'}),
    'cookie-keys': Flags.boolean({description: 'rotate cookie keys'}),
    'max-number-of-jwks': Flags.integer({default: 3}),
    'max-number-of-cookie-keys': Flags.integer({default: 3}),
    'restart-deployment': Flags.string({description: 'Kubernetes deployment name to restart while rotating'}),
    'restart-deployment-backoff': Flags.integer({description: 'Seconds to wait for deployment to restart', default: 60, dependsOn: ['restart-deployment']}),
  }

  static args = {}

  public async run(): Promise<void> {
    const {flags} = await this.parse(Rotate)
    const kubeApiService = new KubeApiService(this, flags)
    kubeApiService.printConfiguration()

    const kubeSecret = await kubeApiService.getSecret()
    if (!kubeSecret) {
      this.error('Secret does not exist')
      this.exit(1)
    }

    const secret = new Secret(this)
    secret.fromKubeSecret(kubeSecret)

    if (flags.both || flags.jwks) {
      secret.appendJWK(flags['max-number-of-jwks'])
    }

    if (flags.both || flags['cookie-keys']) {
      secret.appendCookieKey(flags['max-number-of-cookie-keys'])
    }

    await kubeApiService.replaceSecret(secret)

    if (flags['restart-deployment']) {
      await kubeApiService.restartDeployment(flags['restart-deployment'], flags['restart-deployment-backoff'])
    }

    if (flags.both || flags.jwks) {
      secret.rotateJWKs()
    }

    if (flags.both || flags.jwks) {
      secret.rotateCookieKeys()
    }

    await kubeApiService.replaceSecret(secret)

    if (flags['restart-deployment']) {
      await kubeApiService.restartDeployment(flags['restart-deployment'], flags['restart-deployment-backoff'])
    }
  }
}
