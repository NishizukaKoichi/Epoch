"use client"

import { useState } from "react"
import {
  ImageIcon,
  Lock,
  Users,
  Globe,
  ChevronDown,
  ChevronUp,
  Settings2,
  Clock,
  FileText,
  UserPlus,
  UserX,
  KeyRound,
  Building2,
} from "@/components/icons"
import { EpochVisibilityDialog } from "@/components/epoch-visibility-dialog"
import { EpochRevisionForm } from "@/components/epoch-revision-form"

type RecordType =
  | "decision_made"
  | "decision_not_made"
  | "revised"
  | "period_of_silence"
  | "invited"
  | "declined"
  | "auth_recovered"

type Visibility = "private" | "org_only" | "scout_visible" | "public"

interface EpochRecord {
  id: string
  type: RecordType
  content: string
  timestamp: string
  hash: string
  prevHash: string
  visibility: Visibility
  attachment?: {
    type: string
    name: string
  }
  referencedRecordId?: string
}

interface EpochRecordCardProps {
  record: EpochRecord
  isFirst: boolean
  isOwner?: boolean
}

const recordTypeLabels: Record<RecordType, string> = {
  decision_made: "判断した",
  decision_not_made: "判断しなかった",
  revised: "改訂",
  period_of_silence: "沈黙期間",
  invited: "招待した",
  declined: "辞退した",
  auth_recovered: "認証復旧",
}

const recordTypeIcons: Record<RecordType, typeof Clock> = {
  decision_made: FileText,
  decision_not_made: FileText,
  revised: FileText,
  period_of_silence: Clock,
  invited: UserPlus,
  declined: UserX,
  auth_recovered: KeyRound,
}

const visibilityIcons: Record<Visibility, typeof Lock> = {
  private: Lock,
  org_only: Building2,
  scout_visible: Users,
  public: Globe,
}

const visibilityLabels: Record<Visibility, string> = {
  private: "非公開",
  org_only: "組織限定",
  scout_visible: "スカウト公開",
  public: "公開",
}

function formatTimestamp(iso: string): string {
  const date = new Date(iso)
  return (
    new Intl.DateTimeFormat("ja-JP", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      timeZone: "UTC",
    }).format(date) + " UTC"
  )
}

export function EpochRecordCard({ record, isFirst, isOwner = true }: EpochRecordCardProps) {
  const [showDetails, setShowDetails] = useState(false)
  const [showVisibility, setShowVisibility] = useState(false)
  const [showRevisionForm, setShowRevisionForm] = useState(false)
  const VisibilityIcon = visibilityIcons[record.visibility]
  const TypeIcon = recordTypeIcons[record.type]

  if (record.type === "invited" || record.type === "declined") {
    return (
      <article className="relative pl-8 pb-6">
        <div className="absolute left-1.5 top-1.5 h-3 w-3 rounded-full border-2 border-background bg-blue-500/70" />

        <div className="border border-blue-500/20 bg-blue-500/5 p-4">
          <div className="flex items-center gap-2 mb-2">
            <TypeIcon className="h-4 w-4 text-blue-400" />
            <span className="text-xs font-medium text-blue-400">{recordTypeLabels[record.type]}</span>
          </div>

          <p className="text-sm text-foreground">{record.content}</p>

          <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
            <time className="font-mono">{formatTimestamp(record.timestamp)}</time>
            <button
              onClick={() => setShowDetails(!showDetails)}
              className="flex items-center gap-1 hover:text-foreground transition-colors"
            >
              {showDetails ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
              <span>検証情報</span>
            </button>
          </div>

          {showDetails && (
            <div className="mt-3 pt-3 border-t border-border space-y-2">
              <div className="flex items-start gap-2">
                <span className="text-xs text-muted-foreground w-20 flex-shrink-0">record_hash</span>
                <code className="text-xs font-mono text-muted-foreground break-all">{record.hash}</code>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-xs text-muted-foreground w-20 flex-shrink-0">prev_hash</span>
                <code className="text-xs font-mono text-muted-foreground break-all">{record.prevHash}</code>
              </div>
            </div>
          )}
        </div>
      </article>
    )
  }

  if (record.type === "auth_recovered") {
    return (
      <article className="relative pl-8 pb-6">
        <div className="absolute left-1.5 top-1.5 h-3 w-3 rounded-full border-2 border-background bg-amber-500/70" />

        <div className="border border-amber-500/20 bg-amber-500/5 p-4">
          <div className="flex items-center gap-2 mb-2">
            <KeyRound className="h-4 w-4 text-amber-400" />
            <span className="text-xs font-medium text-amber-400">{recordTypeLabels[record.type]}</span>
          </div>

          <p className="text-sm text-foreground">{record.content}</p>

          <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
            <time className="font-mono">{formatTimestamp(record.timestamp)}</time>
            <button
              onClick={() => setShowDetails(!showDetails)}
              className="flex items-center gap-1 hover:text-foreground transition-colors"
            >
              {showDetails ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
              <span>検証情報</span>
            </button>
          </div>

          {showDetails && (
            <div className="mt-3 pt-3 border-t border-border space-y-2">
              <div className="flex items-start gap-2">
                <span className="text-xs text-muted-foreground w-20 flex-shrink-0">record_hash</span>
                <code className="text-xs font-mono text-muted-foreground break-all">{record.hash}</code>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-xs text-muted-foreground w-20 flex-shrink-0">prev_hash</span>
                <code className="text-xs font-mono text-muted-foreground break-all">{record.prevHash}</code>
              </div>
            </div>
          )}
        </div>
      </article>
    )
  }

  if (record.type === "period_of_silence") {
    return (
      <article className="relative pl-8 pb-6">
        <div className="absolute left-1.5 top-1.5 h-3 w-3 rounded-full border-2 border-background bg-muted-foreground/50" />

        <div className="border border-dashed border-border bg-muted/20 p-4">
          <div className="flex items-center gap-2 text-muted-foreground mb-2">
            <Clock className="h-4 w-4" />
            <span className="text-xs font-mono">{recordTypeLabels[record.type]}</span>
          </div>

          <p className="text-sm text-muted-foreground">{record.content}</p>

          <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
            <time className="font-mono">{formatTimestamp(record.timestamp)}</time>
            <button
              onClick={() => setShowDetails(!showDetails)}
              className="flex items-center gap-1 hover:text-foreground transition-colors"
            >
              {showDetails ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
              <span>検証情報</span>
            </button>
          </div>

          {showDetails && (
            <div className="mt-3 pt-3 border-t border-border space-y-2">
              <div className="flex items-start gap-2">
                <span className="text-xs text-muted-foreground w-20 flex-shrink-0">record_hash</span>
                <code className="text-xs font-mono text-muted-foreground break-all">{record.hash}</code>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-xs text-muted-foreground w-20 flex-shrink-0">prev_hash</span>
                <code className="text-xs font-mono text-muted-foreground break-all">{record.prevHash}</code>
              </div>
            </div>
          )}
        </div>
      </article>
    )
  }

  // Revision form modal
  if (showRevisionForm) {
    return (
      <div className="relative pl-8 pb-6">
        <div className="absolute left-1.5 top-1.5 h-3 w-3 rounded-full border-2 border-background bg-foreground" />
        <EpochRevisionForm
          originalRecord={{
            id: record.id,
            type: record.type,
            content: record.content,
            timestamp: record.timestamp,
          }}
          onCancel={() => setShowRevisionForm(false)}
          onSubmit={(data) => {
            console.log("Revision submitted:", data)
            setShowRevisionForm(false)
          }}
        />
      </div>
    )
  }

  return (
    <>
      <article className="relative pl-8 pb-6">
        {/* Timeline dot */}
        <div
          className={`absolute left-1.5 top-1.5 h-3 w-3 rounded-full border-2 border-background ${
            isFirst ? "bg-green-500" : "bg-foreground"
          }`}
        />

        <div className="border border-border bg-card p-4 transition-colors hover:bg-card/80">
          {/* Header */}
          <div className="mb-3 flex items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="inline-flex items-center px-2 py-0.5 text-xs font-medium bg-secondary text-secondary-foreground">
                {recordTypeLabels[record.type]}
              </span>
              {record.referencedRecordId && (
                <span className="text-xs text-muted-foreground">→ {record.referencedRecordId.slice(0, 8)}...</span>
              )}
              {isOwner ? (
                <button
                  onClick={() => setShowVisibility(true)}
                  className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
                  title="可視性を変更"
                >
                  <VisibilityIcon className="h-3 w-3" />
                  <Settings2 className="h-2.5 w-2.5" />
                </button>
              ) : (
                <span
                  className="inline-flex items-center gap-1 text-xs text-muted-foreground"
                  title={visibilityLabels[record.visibility]}
                >
                  <VisibilityIcon className="h-3 w-3" />
                  <span className="sr-only">{visibilityLabels[record.visibility]}</span>
                </span>
              )}
            </div>
            <time className="text-xs font-mono text-muted-foreground whitespace-nowrap">
              {formatTimestamp(record.timestamp)}
            </time>
          </div>

          {/* Content */}
          <p className="text-sm text-foreground leading-relaxed">{record.content}</p>

          {/* Attachment indicator */}
          {record.attachment && (
            <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
              <ImageIcon className="h-3 w-3" />
              <span>{record.attachment.name}</span>
            </div>
          )}

          {/* Actions */}
          <div className="mt-4 flex items-center justify-between">
            <button
              onClick={() => setShowDetails(!showDetails)}
              className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
              aria-expanded={showDetails}
            >
              {showDetails ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
              <span>検証情報</span>
            </button>

            {isOwner && record.type !== "revised" && (
              <button
                onClick={() => setShowRevisionForm(true)}
                className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                <FileText className="h-3 w-3" />
                <span>改訂を作成</span>
              </button>
            )}
          </div>

          {/* Hash details */}
          {showDetails && (
            <div className="mt-3 pt-3 border-t border-border space-y-2">
              <div className="flex items-start gap-2">
                <span className="text-xs text-muted-foreground w-20 flex-shrink-0">record_id</span>
                <code className="text-xs font-mono text-muted-foreground break-all">{record.id}</code>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-xs text-muted-foreground w-20 flex-shrink-0">record_hash</span>
                <code className="text-xs font-mono text-muted-foreground break-all">{record.hash}</code>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-xs text-muted-foreground w-20 flex-shrink-0">prev_hash</span>
                <code className="text-xs font-mono text-muted-foreground break-all">{record.prevHash}</code>
              </div>
            </div>
          )}
        </div>
      </article>

      <EpochVisibilityDialog
        open={showVisibility}
        onOpenChange={setShowVisibility}
        record={{
          id: record.id,
          currentVisibility: record.visibility,
        }}
      />
    </>
  )
}
