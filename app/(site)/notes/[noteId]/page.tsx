"use client"

import Link from "next/link"
import { useParams } from "next/navigation"
import { ArrowLeft, ArrowRight } from "@/components/icons"
import { use } from "react" // Import the use function from React

// Sample notes data
const notesData: Record<string, {
  title: string
  date: string
  content: string
  tags: string[]
  relatedLinks?: { title: string; href: string }[]
  prevNote?: { id: string; title: string }
  nextNote?: { id: string; title: string }
}> = {
  "note-1": {
    title: "なぜ「履歴を削除できない」を原則にしたか",
    date: "2025-01-15",
    content: `
Epochの最も根本的な原則は「履歴は削除できない」というものだ。

これは技術的な制約ではない。意図的な設計判断だ。

多くのシステムは「間違いを修正できる」ことを価値としている。
しかし、事実の記録においては、この「修正可能性」こそが問題を生む。

・誰かにとって不都合な事実が消される
・過去が都合よく書き換えられる
・「なかったこと」にされる

これらは、記録の信頼性を根本から破壊する。

Epochでは、一度記録された事実は永久に残る。
間違いがあれば、新しい記録として訂正を追記する。
元の記録は消えない。訂正の履歴も残る。

この不可逆性こそが、Epochの価値の源泉だ。
    `.trim(),
    tags: ["Epoch", "設計思想"],
    relatedLinks: [
      { title: "Epoch Spec", href: "/epoch/landing" },
      { title: "Epoch MVP", href: "/epoch" },
    ],
    nextNote: { id: "note-2", title: "Sigilの設計意図について" },
  },
  "note-2": {
    title: "Sigilの設計意図について",
    date: "2025-01-10",
    content: `
Sigilは「変化を許された識別子」を扱う。

これはEpochの「不変性」と対照的に見えるかもしれない。
しかし、両者は矛盾しない。むしろ補完関係にある。

Sigilが扱うのは「今」の状態だ。
・あなたの現在の名前
・あなたの現在の所属
・あなたの現在の肩書き

これらは変わりうる。変わってもいい。
Sigilはその「変化を許す」ことを設計の中心に置いている。

一方、Epochはその変化を「記録」する。
「いつ」「何から」「何に」変わったのか。
それは不可逆な履歴として残る。

Sigil単体では履歴を持たない。
Epochと組み合わせることで、変化の履歴が生まれる。

これが「プロダクト間の境界線」の一例だ。
    `.trim(),
    tags: ["Sigil", "設計思想"],
    relatedLinks: [
      { title: "Sigil Library", href: "/library/sigil" },
    ],
    prevNote: { id: "note-1", title: "なぜ「履歴を削除できない」を原則にしたか" },
    nextNote: { id: "note-3", title: "プロダクト間の境界線" },
  },
  "note-3": {
    title: "プロダクト間の境界線",
    date: "2025-01-05",
    content: `
Sigil、Epoch、Talisman、Pact。

これらは独立したプロダクトだが、組み合わせて使うことを想定している。
では、なぜ一つのプロダクトにまとめないのか。

答えは「関心の分離」だ。

・Sigilは「識別」に集中する
・Epochは「記録」に集中する
・Talismanは「証明の携帯」に集中する
・Pactは「契約の状態遷移」に集中する

それぞれが単一の責務を持つ。
それぞれが独立して動作できる。
しかし、組み合わせることでより大きな価値が生まれる。

この境界線は恣意的ではない。
「扱うもの」と「扱わないもの」を明確にすることで、
各プロダクトの設計判断がシンプルになる。

何をしないかを決めることは、何をするかを決めることと同じくらい重要だ。
    `.trim(),
    tags: ["全体設計"],
    relatedLinks: [
      { title: "Library", href: "/library" },
    ],
    prevNote: { id: "note-2", title: "Sigilの設計意図について" },
  },
}

export default function NoteDetailPage() {
  const params = useParams()
  const noteId = params.noteId as string
  
  const note = notesData[noteId]
  
  if (!note) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-16">
        <p className="text-muted-foreground">Note not found</p>
        <Link href="/notes" className="text-sm text-foreground hover:underline mt-4 inline-block">
          Back to Notes
        </Link>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-16">
      {/* Back link */}
      <Link 
        href="/notes"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
      >
        <ArrowLeft className="h-3 w-3" />
        Notes
      </Link>

      {/* Header */}
      <header className="mb-8">
        <h1 className="text-xl font-medium text-foreground mb-3">
          {note.title}
        </h1>
        <div className="flex items-center gap-4">
          <time className="text-xs text-muted-foreground">
            {note.date}
          </time>
          {note.tags && note.tags.length > 0 && (
            <div className="flex gap-2">
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
      </header>

      {/* Content */}
      <article className="prose prose-invert prose-sm max-w-none">
        {note.content.split('\n\n').map((paragraph, index) => (
          <p key={index} className="text-foreground/90 leading-relaxed mb-4">
            {paragraph}
          </p>
        ))}
      </article>

      {/* Related Links */}
      {note.relatedLinks && note.relatedLinks.length > 0 && (
        <div className="mt-12 pt-8 border-t border-border">
          <h3 className="text-xs uppercase tracking-wider text-muted-foreground mb-4">
            Related
          </h3>
          <div className="flex flex-wrap gap-3">
            {note.relatedLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                {link.title}
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Prev/Next Navigation */}
      <nav className="mt-12 pt-8 border-t border-border flex items-center justify-between">
        {note.prevNote ? (
          <Link
            href={`/notes/${note.prevNote.id}`}
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-3 w-3" />
            <span className="truncate max-w-[200px]">{note.prevNote.title}</span>
          </Link>
        ) : (
          <div />
        )}
        {note.nextNote ? (
          <Link
            href={`/notes/${note.nextNote.id}`}
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <span className="truncate max-w-[200px]">{note.nextNote.title}</span>
            <ArrowRight className="h-3 w-3" />
          </Link>
        ) : (
          <div />
        )}
      </nav>
    </div>
  )
}
