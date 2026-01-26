import * as React from "react"
import { cn } from "@/lib/utils"

export type SliderProps = React.InputHTMLAttributes<HTMLInputElement>

export const Slider = React.forwardRef<HTMLInputElement, SliderProps>(({ className, ...props }, ref) => (
  <input ref={ref} type="range" className={cn("h-2 w-full", className)} {...props} />
))

Slider.displayName = "Slider"
