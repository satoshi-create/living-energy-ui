// Shared region / weather mock. Feature data lives under features/*/data.ts.

export type AppLocale = 'ja' | 'en'

export type Region = {
  id: string
  label: string
  labelEn: string
  prefecture: string
  prefectureEn: string
}

export const REGIONS: Region[] = [
  {
    id: 'hokuto',
    label: '山梨県 北杜市',
    labelEn: 'Hokuto, Yamanashi',
    prefecture: '山梨県',
    prefectureEn: 'Yamanashi',
  },
  {
    id: 'setagaya',
    label: '東京都 世田谷区',
    labelEn: 'Setagaya, Tokyo',
    prefecture: '東京都',
    prefectureEn: 'Tokyo',
  },
  {
    id: 'koriyama',
    label: '福島県 郡山市',
    labelEn: 'Koriyama, Fukushima',
    prefecture: '福島県',
    prefectureEn: 'Fukushima',
  },
  {
    id: 'akita',
    label: '秋田県 秋田市',
    labelEn: 'Akita City, Akita',
    prefecture: '秋田県',
    prefectureEn: 'Akita',
  },
]

export function localizedRegion(
  region: Region,
  locale: AppLocale
): { label: string; prefecture: string } {
  return locale === 'en'
    ? { label: region.labelEn, prefecture: region.prefectureEn }
    : { label: region.label, prefecture: region.prefecture }
}

export type WeatherState = {
  label: string
  labelEn: string
  icon: 'sun' | 'cloud-sun' | 'cloud'
  irradiance: number // W/m^2
}

export const WEATHER: WeatherState = {
  label: '快晴',
  labelEn: 'Clear skies',
  icon: 'sun',
  irradiance: 850,
}

export function localizedWeatherLabel(
  weather: WeatherState,
  locale: AppLocale
): string {
  return locale === 'en' ? weather.labelEn : weather.label
}
