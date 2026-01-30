"use client"

const STORAGE_KEY = "talisman:person_id"

export function getStoredPersonId(): string | null {
  if (typeof window === "undefined") return null
  return window.localStorage.getItem(STORAGE_KEY)
}

export function setStoredPersonId(personId: string): void {
  if (typeof window === "undefined") return
  window.localStorage.setItem(STORAGE_KEY, personId)
}

export function clearStoredPersonId(): void {
  if (typeof window === "undefined") return
  window.localStorage.removeItem(STORAGE_KEY)
}

export async function ensurePersonId(): Promise<string> {
  const existing = getStoredPersonId()
  if (existing) {
    return existing
  }
  const response = await fetch("/api/v1/talisman/persons", { method: "POST" })
  if (!response.ok) {
    const payload = await response.json().catch(() => null)
    throw new Error(payload?.error || "person_idの生成に失敗しました")
  }
  const data = (await response.json()) as { person_id: string }
  setStoredPersonId(data.person_id)
  return data.person_id
}
