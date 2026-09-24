"use client"

import { useLocale, useTranslations } from "next-intl"
import { useTransition } from "react"
import { cn } from "@/lib/utils"
import { usePathname, useRouter } from "@/i18n/navigation"
import { routing, type AppLocale } from "@/i18n/routing"

type LanguageSwitcherProps = {
  className?: string
}

export function LanguageSwitcher({ className }: LanguageSwitcherProps) {
  const t = useTranslations("shell.language")
  const locale = useLocale()
  const router = useRouter()
  const pathname = usePathname()
  const [isPending, startTransition] = useTransition()

  function switchLocale(next: AppLocale) {
    if (next === locale) return
    startTransition(() => {
      router.replace(pathname, { locale: next })
    })
  }

  return (
    <div
      role="group"
      aria-label={t("label")}
      className={cn(
        "inline-flex items-center rounded-lg border border-border/60 bg-muted/40 p-0.5 text-xs font-medium",
        isPending && "opacity-70",
        className
      )}
    >
      {routing.locales.map((code) => {
        const isActive = code === locale
        return (
          <button
            key={code}
            type="button"
            disabled={isPending}
            aria-pressed={isActive}
            onClick={() => switchLocale(code)}
            className={cn(
              "rounded-md px-2.5 py-1.5 transition-colors",
              isActive
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            {t(code)}
          </button>
        )
      })}
    </div>
  )
}
