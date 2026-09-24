import type ja from './messages/ja.json'

type Messages = typeof ja

declare global {
  // Augment next-intl message keys for typed useTranslations / getTranslations.
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  interface IntlMessages extends Messages {}
}

export {}
