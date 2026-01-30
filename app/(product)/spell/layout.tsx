import React from "react"
import { SpellHeader } from "@/components/spell/spell-header"

export default function SpellLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-background">
      <SpellHeader />
      <main>{children}</main>
    </div>
  )
}
