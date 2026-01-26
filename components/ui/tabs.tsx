import * as React from "react"
import { cn } from "@/lib/utils"

interface TabsContextValue {
  value: string
  setValue: (value: string) => void
}

const TabsContext = React.createContext<TabsContextValue | null>(null)

export function Tabs({ defaultValue, value, onValueChange, className, children }: {
  defaultValue?: string
  value?: string
  onValueChange?: (value: string) => void
  className?: string
  children: React.ReactNode
}) {
  const [internal, setInternal] = React.useState(defaultValue ?? "")
  const currentValue = value ?? internal
  const setValue = (next: string) => {
    if (onValueChange) onValueChange(next)
    else setInternal(next)
  }

  return (
    <TabsContext.Provider value={{ value: currentValue, setValue }}>
      <div className={cn("space-y-2", className)}>{children}</div>
    </TabsContext.Provider>
  )
}

export function TabsList({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("inline-flex items-center gap-1", className)} {...props} />
}

export function TabsTrigger({ value, className, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement> & { value: string }) {
  const context = React.useContext(TabsContext)
  const isActive = context?.value === value
  return (
    <button
      className={cn(
        "px-3 py-1.5 text-sm rounded-md transition-colors",
        isActive ? "bg-background text-foreground" : "text-muted-foreground hover:text-foreground",
        className,
      )}
      onClick={() => context?.setValue(value)}
      {...props}
    />
  )
}

export function TabsContent({ value, className, ...props }: React.HTMLAttributes<HTMLDivElement> & { value: string }) {
  const context = React.useContext(TabsContext)
  if (context?.value !== value) return null
  return <div className={cn("mt-2", className)} {...props} />
}
