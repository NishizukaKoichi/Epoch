"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowRight, Settings, Save, X } from "@/components/icons"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { useI18n } from "@/lib/i18n/context"
import { useAuth } from "@/lib/auth/context"

export default function AboutPage() {
  const { t } = useI18n()
  const { isAdmin } = useAuth()
  const [isEditing, setIsEditing] = useState(false)
  
  // 編集可能なコンテンツ（実際はDBから取得）
  const [authorText, setAuthorText] = useState(
    "Koichi Nishizuka。ソフトウェアの仕様を書く人。\n\nこのサイトは、作者が設計したプロダクトの仕様を棚として提示するためのものです。商用サイトのような売り込みや勧誘を目的としていません。"
  )
  const [philosophyText, setPhilosophyText] = useState(
    "思想・価値観と、実装・仕様は明確に分離されるべきだと考えています。\n\n仕様は「何をするか」「何をしないか」を定義するものです。なぜそうするのかは、仕様の外にあります。\n\nこのサイトでは、仕様を最短距離で参照できることを優先しています。思考の背景やプロセスは Notes に記録しています。"
  )

  return (
    <div className="mx-auto max-w-2xl px-4 py-16">
      {/* Header */}
      <div className="flex items-center justify-between mb-12">
        <h1 className="text-2xl font-medium text-foreground">
          {t("site.about_title")}
        </h1>
        {isAdmin && (
          isEditing ? (
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" onClick={() => setIsEditing(false)} className="gap-1">
                <X className="h-4 w-4" />
                キャンセル
              </Button>
              <Button size="sm" onClick={() => setIsEditing(false)} className="gap-1">
                <Save className="h-4 w-4" />
                保存
              </Button>
            </div>
          ) : (
            <Button variant="ghost" size="icon" onClick={() => setIsEditing(true)} className="h-8 w-8 text-muted-foreground hover:text-foreground">
              <Settings className="h-4 w-4" />
            </Button>
          )
        )}
      </div>

      {/* Author Section */}
      <section className="mb-16">
        <h2 className="text-xs uppercase tracking-wider text-muted-foreground mb-4">
          {t("site.about_author")}
        </h2>
        {isEditing ? (
          <Textarea
            value={authorText}
            onChange={(e) => setAuthorText(e.target.value)}
            rows={6}
            className="text-sm"
          />
        ) : (
          <div className="space-y-4 text-sm text-foreground/90 leading-relaxed">
            {authorText.split("\n\n").map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
        )}
      </section>

      {/* Philosophy Section */}
      <section className="mb-16">
        <h2 className="text-xs uppercase tracking-wider text-muted-foreground mb-4">
          {t("site.about_philosophy")}
        </h2>
        {isEditing ? (
          <Textarea
            value={philosophyText}
            onChange={(e) => setPhilosophyText(e.target.value)}
            rows={10}
            className="text-sm"
          />
        ) : (
          <div className="space-y-4 text-sm text-foreground/90 leading-relaxed">
            {philosophyText.split("\n\n").map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
        )}
      </section>

      {/* Navigation */}
      <div className="pt-8 border-t border-border flex flex-wrap gap-6">
        <Link
          href="/site/library"
          className="inline-flex items-center gap-1.5 text-sm text-foreground hover:text-foreground/80 transition-colors"
        >
          Library
          <ArrowRight className="h-3 w-3" />
        </Link>
        <Link
          href="/site/notes"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          Notes
          <ArrowRight className="h-3 w-3" />
        </Link>
        <Link
          href="/site/contact"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          Contact
          <ArrowRight className="h-3 w-3" />
        </Link>
      </div>
    </div>
  )
}
