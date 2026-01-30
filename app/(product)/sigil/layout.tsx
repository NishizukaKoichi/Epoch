import React from "react"
import { SigilHeader } from "@/components/sigil/sigil-header"

export default function SigilLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-background">
      <SigilHeader />
      <main className="mx-auto max-w-4xl px-4 py-8">
        {children}
      </main>
    </div>
  )
}
