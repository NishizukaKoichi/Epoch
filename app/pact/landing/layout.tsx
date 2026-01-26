import React from "react"
import { GlobalNav } from "@/components/global-nav"

export default function PactLandingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-background">
      <GlobalNav />
      <main className="mx-auto max-w-4xl px-4 py-8">
        {children}
      </main>
    </div>
  )
}
