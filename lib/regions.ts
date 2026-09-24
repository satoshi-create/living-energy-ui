// Shared region / weather mock. Feature data lives under features/*/data.ts.

export type Region = {
  id: string
  label: string
  prefecture: string
}

export const REGIONS: Region[] = [
  { id: 'hokuto', label: '山梨県 北杜市', prefecture: '山梨県' },
  { id: 'setagaya', label: '東京都 世田谷区', prefecture: '東京都' },
  { id: 'koriyama', label: '福島県 郡山市', prefecture: '福島県' },
  { id: 'akita', label: '秋田県 秋田市', prefecture: '秋田県' },
]

export type WeatherState = {
  label: string
  icon: 'sun' | 'cloud-sun' | 'cloud'
  irradiance: number // W/m^2
}

export const WEATHER: WeatherState = {
  label: '快晴',
  icon: 'sun',
  irradiance: 850,
}
