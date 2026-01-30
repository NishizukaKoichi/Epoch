import React from "react"
export default function SpellLandingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Landing page doesn't use the standard header
  return <>{children}</>
}
