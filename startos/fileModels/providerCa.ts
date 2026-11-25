import { X509Certificate } from 'node:crypto'
import { FileHelper } from '@start9labs/start-sdk'
import { i18n } from '../i18n'
import { sdk } from '../sdk'

export const providerCaDirectory = 'provider-trust'
export const providerCaMountpoint = '/etc/opencode-trust'
export const providerCaPath = providerCaMountpoint + '/ca.pem'
export const providerCa = FileHelper.string({
  base: sdk.volumes.startos,
  subpath: providerCaDirectory + '/ca.pem',
})

export function normalizeProviderCa(input: string): string {
  const pem = input.trim()
  if (!pem) return ''
  if (
    !/^-----BEGIN CERTIFICATE-----\r?\n[A-Za-z0-9+/=\r\n]+\r?\n-----END CERTIFICATE-----$/.test(
      pem,
    )
  ) {
    throw new Error(i18n('Paste one public PEM CA certificate.'))
  }
  const cert = new X509Certificate(pem)
  if (!cert.ca) throw new Error(i18n('This certificate is not a CA.'))
  return cert.toString().trim() + '\n'
}
