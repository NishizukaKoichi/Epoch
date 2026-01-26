"use client"

import type { ReactNode } from "react"

export interface ThemeProviderProps {
  children: ReactNode
  [key: string]: unknown
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  return <>{children}</>
}
