import * as React from "react"
import { cn } from "@/lib/utils"

interface RadioGroupContextValue {
  value?: string
  onValueChange?: (value: string) => void
}

const RadioGroupContext = React.createContext<RadioGroupContextValue | null>(null)

export function RadioGroup({
  value,
  onValueChange,
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & RadioGroupContextValue) {
  return (
    <RadioGroupContext.Provider value={{ value, onValueChange }}>
      <div className={cn("space-y-2", className)} {...props}>
        {children}
      </div>
    </RadioGroupContext.Provider>
  )
}

export function RadioGroupItem({
  value,
  className,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & { value: string }) {
  const context = React.useContext(RadioGroupContext)
  return (
    <label className={cn("inline-flex items-center gap-2", className)}>
      <input
        type="radio"
        value={value}
        checked={context?.value === value}
        onChange={() => context?.onValueChange?.(value)}
        {...props}
      />
    </label>
  )
}
