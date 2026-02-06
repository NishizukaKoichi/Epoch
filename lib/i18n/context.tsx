"use client"

import { createContext, useContext, useState, type ReactNode } from "react"
import {
  translations,
  localeNames,
  defaultLocale,
  type BaseLocale,
  type Locale,
  type TranslationKey,
} from "./translations"

interface I18nContextType {
  locale: Locale
  language: Locale
  setLocale: (locale: Locale) => void
  t: (key: TranslationKey) => string
}

const I18nContext = createContext<I18nContextType | null>(null)

const getInitialLocale = (): Locale => {
  if (typeof window === "undefined") {
    return defaultLocale
  }

  const saved = window.localStorage.getItem("epoch-locale") as Locale | null
  if (saved && saved in localeNames) {
    return saved
  }

  const browserLang = navigator.language.split("-")[0] as Locale
  if (browserLang in localeNames) {
    return browserLang
  }

  return defaultLocale
}

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(getInitialLocale)

  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale)
    if (typeof window !== "undefined") {
      window.localStorage.setItem("epoch-locale", newLocale)
    }
  }

  const t = (key: TranslationKey): string => {
    const currentTranslations = (locale in translations
      ? translations[locale as BaseLocale]
      : null) as Partial<Record<TranslationKey, string>> | null
    const fallbackTranslations = translations[defaultLocale as BaseLocale]

    return currentTranslations?.[key] ?? fallbackTranslations[key] ?? key
  }

  return (
    <I18nContext.Provider value={{ locale, language: locale, setLocale, t }}>
      {children}
    </I18nContext.Provider>
  )
}

export function useI18n() {
  const context = useContext(I18nContext)
  if (!context) {
    throw new Error("useI18n must be used within an I18nProvider")
  }
  return context
}
