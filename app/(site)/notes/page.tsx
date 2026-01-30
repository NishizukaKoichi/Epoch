"use client"

import Link from "next/link"
import { Settings } from "@/components/icons"
import { Button } from "@/components/ui/button"
import { useI18n } from "@/lib/i18n/context"
import { useAuth } from "@/lib/auth/context"

// Sample notes data
const notes = [
  {
    id: "note-1",
    title: "なぜ「履歴を削除できない」を原則にしたか",
    date: "2025-01-15",
    tags: ["Epoch", "設計思想"],
  },
  {
    id: "note-2",
    title: "Sigilの設計意図について",
    date: "2025-01-10",
    tags: ["Sigil", "設計思想"],
  },
  {
    id: "note-3",
    title: "プロダクト間の境界線",
    date: "2025-01-05",
    tags: ["全体設計"],
  },
  {
    id: "note-4",
    title: "「評価しない」という選択",
    date: "2024-12-28",
    tags: ["Epoch", "原則"],
  },
  {
    id: "note-5",
    title: "Talismanが解決する問題",
    date: "2024-12-20",
    tags: ["Talisman", "設計思想"],
  },
]

export default function NotesPage() {
  const { t } = useI18n()
  const { isAdmin } = useAuth()

  return (
    <div className="mx-auto max-w-4xl px-4 py-16">
      {/* Header */}
      <div className="mb-12 flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-medium text-foreground mb-2">
            {t("site.notes_title")}
          </h1>
          <p className="text-sm text-muted-foreground">
            {t("site.notes_desc")}
          </p>
        </div>
        {isAdmin && (
          <Link href="/notes/admin">
            <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground">
              <Settings className="h-4 w-4" />
            </Button>
          </Link>
        )}
      </div>

      {/* Notes List */}
      {notes.length > 0 ? (
        <div className="space-y-1">
          {notes.map((note) => (
            <Link
              key={note.id}
              href={`/notes/${note.id}`}
              className="block group"
            >
              <article className="flex items-center justify-between py-4 border-b border-border/50 hover:border-border transition-colors">
                <div className="flex-1 min-w-0">
                  <h2 className="text-sm text-foreground group-hover:text-foreground/80 transition-colors truncate">
                    {note.title}
                  </h2>
                  {note.tags && note.tags.length > 0 && (
                    <div className="flex gap-2 mt-1.5">
                      {note.tags.map((tag) => (
                        <span
                          key={tag}
                          className="text-[10px] text-muted-foreground bg-muted px-1.5 py-0.5 rounded"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                <time className="text-xs text-muted-foreground shrink-0 ml-4">
                  {note.date}
                </time>
              </article>
            </Link>
          ))}
        </div>
      ) : (
        <p className="text-sm text-muted-foreground">{t("site.no_notes")}</p>
      )}
    </div>
  )
}
