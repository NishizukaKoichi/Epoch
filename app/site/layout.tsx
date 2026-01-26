import React from "react"
import type { Metadata } from "next"
import { SiteHeader } from "@/components/site/site-header"
import { SiteFooter } from "@/components/site/site-footer"

export const metadata: Metadata = {
  title: {
    default: "Koichi Nishizuka",
    template: "%s | Koichi Nishizuka",
  },
  description: "Specification Library - A place to understand before you buy",
}

export default function SiteLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <SiteHeader />
      <main className="flex-1">
        {children}
      </main>
      <SiteFooter />
    </div>
  )
}
