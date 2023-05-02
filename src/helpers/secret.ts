import {JwkObject, KEYUTIL} from 'jsrsasign'
import {V1ObjectMeta, V1Secret} from '@kubernetes/client-node'
import crypto from 'node:crypto'

const JWKSKeyName = 'OIDC_JWKS'
const CookieKeysKeyName = 'OIDC_COOKIE_KEYS'

type FullJwkObject = JwkObject & {use: string}

export class Secret {
  private JWKs: Array<FullJwkObject>
  private CookieKeys: Array<string>

  constructor() {
    this.JWKs = []
    this.CookieKeys = []
  }

  generateNew(): void {
    this.JWKs = [this.#generateRSAJwk(4096)]
    this.CookieKeys = [this.#generateCookieKey(32)]
  }

  #generateRSAJwk(len: number): FullJwkObject {
    const keypair = KEYUTIL.generateKeypair('RSA', len)
    const jwk = KEYUTIL.getJWK(keypair.prvKeyObj)
    return {
      ...jwk,
      use: 'sig',
    }
  }

  #generateCookieKey(size: number): string {
    return crypto.randomBytes(size).toString('hex')
  }

  toKubeSecret(secretName: string): V1Secret {
    const secret = new V1Secret()
    secret.metadata = this.#getKubeSecretMetadata(secretName)
    secret.data = {}
    secret.data[JWKSKeyName] = this.#arrayToB64String(this.JWKs)
    secret.data[CookieKeysKeyName] = this.#arrayToB64String(this.CookieKeys)
    return secret
  }

  #arrayToB64String(array: Array<FullJwkObject|string>): string {
    const b = Buffer.from(JSON.stringify(array))
    return b.toString('base64')
  }

  #getKubeSecretMetadata(secretName: string): V1ObjectMeta {
    const metaData = new V1ObjectMeta()
    metaData.name = secretName
    return metaData
  }
}
