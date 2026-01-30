"use client"

import { useEffect, useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, User } from "@/components/icons"

interface EpochSearchUserProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSelectUser: (userId: string) => void
}

interface UserResult {
  userId: string
  displayName: string | null
  recordCount: number
}

export function EpochSearchUser({ open, onOpenChange, onSelectUser }: EpochSearchUserProps) {
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<UserResult[]>([])
  const [allUsers, setAllUsers] = useState<UserResult[]>([])
  const [searched, setSearched] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!open) {
      return
    }
    const load = async () => {
      setIsLoading(true)
      setError(null)
      try {
        const response = await fetch("/api/epoch/directory/users")
        if (!response.ok) {
          const payload = await response.json().catch(() => null)
          throw new Error(payload?.error || "ユーザー一覧の取得に失敗しました")
        }
        const data = (await response.json()) as { users: UserResult[] }
        setAllUsers(data.users ?? [])
      } catch (err) {
        const message = err instanceof Error ? err.message : "ユーザー一覧の取得に失敗しました"
        setError(message)
      } finally {
        setIsLoading(false)
      }
    }
    load()
  }, [open])

  const handleSearch = () => {
    if (query.trim()) {
      const normalized = query.trim().toLowerCase()
      setResults(
        allUsers.filter((u) =>
          u.userId.toLowerCase().includes(normalized) ||
          (u.displayName ?? "").toLowerCase().includes(normalized)
        )
      )
      setSearched(true)
    }
  }

  const handleSelect = (userId: string) => {
    onSelectUser(userId)
    onOpenChange(false)
    setQuery("")
    setResults([])
    setSearched(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-card border-border">
        <DialogHeader>
          <DialogTitle className="text-foreground">ユーザーを検索</DialogTitle>
          <DialogDescription className="text-muted-foreground">ユーザーIDまたは表示名で検索できます</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex gap-2">
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="user_id または表示名"
              className="bg-background border-border text-foreground"
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            />
            <Button onClick={handleSearch} className="bg-foreground text-background hover:bg-foreground/90">
              <Search className="h-4 w-4" />
            </Button>
          </div>

          {error && (
            <div className="text-xs text-destructive border border-destructive/30 bg-destructive/10 px-3 py-2 rounded">
              {error}
            </div>
          )}

          {isLoading && (
            <div className="text-sm text-muted-foreground">読み込み中...</div>
          )}

          {searched && !isLoading && (
            <div className="space-y-2">
              {results.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground text-sm">該当するユーザーが見つかりません</div>
              ) : (
                results.map((user) => (
                  <button
                    key={user.userId}
                    onClick={() => handleSelect(user.userId)}
                    className="w-full p-3 border border-border rounded-lg bg-muted/20 hover:bg-muted/40 transition-colors text-left"
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
                        <User className="h-5 w-5 text-muted-foreground" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-foreground">{user.displayName ?? user.userId}</p>
                        <p className="text-xs text-muted-foreground font-mono">{user.userId}</p>
                      </div>
                      <div className="text-xs text-muted-foreground">{user.recordCount} records</div>
                    </div>
                  </button>
                ))
              )}
            </div>
          )}

          <p className="text-xs text-muted-foreground">
            検索機能は公開設定されたユーザーのみを対象とします。全文検索は提供されません。
          </p>
        </div>
      </DialogContent>
    </Dialog>
  )
}
