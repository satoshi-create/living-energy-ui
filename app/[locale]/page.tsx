import { setRequestLocale } from 'next-intl/server'
import { AppShell } from '@/features/shell'

type PageProps = {
  params: Promise<{ locale: string }>
}

export default async function Page({ params }: PageProps) {
  const { locale } = await params
  setRequestLocale(locale)

  return <AppShell />
}
