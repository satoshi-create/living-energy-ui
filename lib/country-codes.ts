export type CountryCode = 'DE' | 'AT' | 'IT' | 'GB' | 'FR' | 'BE' | 'CH' | 'CN' | 'JP' | 'US' | 'EU'

/** ecosystem 既存フィルタへの射影 */
export function toRegionScope(code: CountryCode): 'japan' | 'global' {
  return code === 'JP' ? 'japan' : 'global'
}
