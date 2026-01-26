"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { translations, defaultLocale, type Locale, type TranslationKey } from "./translations"

interface I18nContextType {
  locale: Locale
  setLocale: (locale: Locale) => void
  t: (key: TranslationKey) => string
}

const I18nContext = createContext<I18nContextType | null>(null)

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(defaultLocale)

  useEffect(() => {
    // Detect browser language on mount
    const browserLang = navigator.language.split("-")[0] as Locale
    if (browserLang in translations) {
      setLocaleState(browserLang)
    }

    // Check localStorage for saved preference
    const saved = localStorage.getItem("epoch-locale") as Locale
    if (saved && saved in translations) {
      setLocaleState(saved)
    }
  }, [])

  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale)
    localStorage.setItem("epoch-locale", newLocale)
  }

  const t = (key: TranslationKey): string => {
    const currentTranslations = translations[locale]
    const fallbackTranslations = translations[defaultLocale]

    // @ts-expect-error - key might not exist in all locales
    return currentTranslations[key] ?? fallbackTranslations[key] ?? key
  }

  return <I18nContext.Provider value={{ locale, setLocale, t }}>{children}</I18nContext.Provider>
}

export function useI18n() {
  const context = useContext(I18nContext)
  if (!context) {
    throw new Error("useI18n must be used within an I18nProvider")
  }
  return context
}
