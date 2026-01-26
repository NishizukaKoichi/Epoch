export type ClassValue =
  | string
  | number
  | null
  | false
  | undefined
  | ClassValue[]
  | { [key: string]: boolean }

export function cn(...inputs: ClassValue[]) {
  const classes: string[] = []

  const walk = (value: ClassValue): void => {
    if (!value) return
    if (typeof value === "string" || typeof value === "number") {
      classes.push(String(value))
      return
    }
    if (Array.isArray(value)) {
      value.forEach(walk)
      return
    }
    if (typeof value === "object") {
      for (const [key, enabled] of Object.entries(value)) {
        if (enabled) classes.push(key)
      }
    }
  }

  inputs.forEach(walk)
  return classes.join(" ")
}
