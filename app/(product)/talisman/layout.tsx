import React from "react"
import { TalismanHeader } from "@/components/talisman/talisman-header"

export default function TalismanLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-background">
      <TalismanHeader />
      <main className="mx-auto max-w-4xl px-4 py-8">
        {children}
      </main>
    </div>
  )
}
