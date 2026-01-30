import type React from "react"
import { GlobalNav } from "@/components/global-nav"

export default function ProductLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-background">
      <GlobalNav />
      {children}
    </div>
  )
}
