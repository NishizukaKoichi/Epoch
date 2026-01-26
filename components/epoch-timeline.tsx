"use client"

import { useState, useMemo } from "react"
import { EpochRecordCard } from "@/components/epoch-record-card"
import { EpochHashVerification } from "@/components/epoch-hash-verification"
import { EpochTimelineFilters, type RecordTypeFilter } from "@/components/epoch-timeline-filters"
import { Shield, ChevronDown, ChevronUp } from "@/components/icons"
import { Button } from "@/components/ui/button"

// Mock data for demonstration
const mockRecords = [
  {
    id: "01J5QKXR8V0000000000000001",
    type: "decision_made" as const,
    content: "プロジェクトAの提案を承諾した。契約期間は6ヶ月。",
    timestamp: "2024-08-15T09:23:45Z",
    hash: "a3f2c1b8e9d4f5a6b7c8d9e0f1a2b3c4",
    prevHash: "b4g3d2c9f0e5g6b8c9d0e1f2g3h4i5j6",
    visibility: "private" as const,
  },
  {
    id: "01J5QKXR8V0000000000000002",
    type: "invited" as const,
    content: "田中太郎さんにスカウトを送信した。",
    timestamp: "2024-08-14T16:30:00Z",
    hash: "b4g3d2c9f0e5g6b8c9d0e1f2g3h4i5j6",
    prevHash: "c5h4e3d0g1f6h7c9d0e1f2g3h4i5j6k7",
    visibility: "private" as const,
  },
  {
    id: "01J5QKXR8V0000000000000003",
    type: "decision_not_made" as const,
    content: "B社からのオファーを保留した。条件の再提示を待つ。",
    timestamp: "2024-08-14T14:12:30Z",
    hash: "c5h4e3d0g1f6h7c9d0e1f2g3h4i5j6k7",
    prevHash: "d6i5f4e1h2g7i8d0e1f2g3h4i5j6k7l8",
    visibility: "scout_visible" as const,
  },
  {
    id: "01J5QKXR8V0000000000000004",
    type: "period_of_silence" as const,
    content: "2024年8月1日から8月13日まで、記録なし。",
    timestamp: "2024-08-13T00:00:00Z",
    hash: "d6i5f4e1h2g7i8d0e1f2g3h4i5j6k7l8",
    prevHash: "e7j6g5f2i3h8j9e1f2g3h4i5j6k7l8m9",
    visibility: "private" as const,
  },
  {
    id: "01J5QKXR8V0000000000000005",
    type: "revised" as const,
    content: "前回の判断に対する補足：契約条項の一部を修正合意した。",
    timestamp: "2024-07-31T16:45:00Z",
    hash: "e7j6g5f2i3h8j9e1f2g3h4i5j6k7l8m9",
    prevHash: "f8k7h6g3j4i9k0f2g3h4i5j6k7l8m9n0",
    visibility: "public" as const,
    attachment: {
      type: "image",
      name: "contract-amendment.png",
    },
    referencedRecordId: "01J5QKXR8V0000000000000006",
  },
  {
    id: "01J5QKXR8V0000000000000006",
    type: "decision_made" as const,
    content: "新規事業の立ち上げに参画することを決定した。",
    timestamp: "2024-07-28T10:00:00Z",
    hash: "f8k7h6g3j4i9k0f2g3h4i5j6k7l8m9n0",
    prevHash: "0000000000000000000000000000000",
    visibility: "private" as const,
  },
]

const RECORDS_PER_PAGE = 20

export function EpochTimeline() {
  const [showVerification, setShowVerification] = useState(false)
  const [filters, setFilters] = useState<{
    keyword: string
    recordType: RecordTypeFilter
    dateRange: { from: Date | undefined; to: Date | undefined }
  }>({
    keyword: "",
    recordType: "all",
    dateRange: { from: undefined, to: undefined },
  })
  const [visibleCount, setVisibleCount] = useState(RECORDS_PER_PAGE)

  const filteredRecords = useMemo(() => {
    return mockRecords.filter((record) => {
      // Keyword filter (simple text match, not AI-powered)
      if (filters.keyword) {
        const keywordLower = filters.keyword.toLowerCase()
        if (!record.content.toLowerCase().includes(keywordLower)) {
          return false
        }
      }

      // Record type filter
      if (filters.recordType !== "all" && record.type !== filters.recordType) {
        return false
      }

      // Date range filter
      const recordDate = new Date(record.timestamp)
      if (filters.dateRange.from && recordDate < filters.dateRange.from) {
        return false
      }
      if (filters.dateRange.to) {
        const toDateEnd = new Date(filters.dateRange.to)
        toDateEnd.setHours(23, 59, 59, 999)
        if (recordDate > toDateEnd) {
          return false
        }
      }

      return true
    })
  }, [filters])

  const visibleRecords = filteredRecords.slice(0, visibleCount)
  const hasMore = visibleCount < filteredRecords.length

  const loadMore = () => {
    setVisibleCount((prev) => Math.min(prev + RECORDS_PER_PAGE, filteredRecords.length))
  }

  return (
    <section>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-sm font-medium text-foreground">履歴</h2>
        <button
          onClick={() => setShowVerification(!showVerification)}
          className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          <Shield className="h-3.5 w-3.5" />
          <span>整合性検証</span>
          {showVerification ? (
            <ChevronUp className="h-3 w-3" />
          ) : (
            <ChevronDown className="h-3 w-3" />
          )}
        </button>
      </div>

      <EpochTimelineFilters
        onFilterChange={setFilters}
        totalCount={mockRecords.length}
        filteredCount={filteredRecords.length}
      />

      {showVerification && (
        <div className="mb-6">
          <EpochHashVerification records={filteredRecords} />
        </div>
      )}

      <div className="relative">
        {/* Timeline line */}
        <div className="absolute left-3 top-0 bottom-0 w-px bg-border" />

        <div className="space-y-1">
          {visibleRecords.map((record, index) => (
            <EpochRecordCard
              key={record.id}
              record={record}
              isFirst={index === 0}
            />
          ))}
        </div>

        {hasMore && (
          <div className="mt-6 flex justify-center">
            <Button
              variant="outline"
              onClick={loadMore}
              className="border-border bg-transparent text-muted-foreground hover:text-foreground"
            >
              さらに読み込む（残り {filteredRecords.length - visibleCount} 件）
            </Button>
          </div>
        )}

        {filteredRecords.length === 0 && (
          <div className="py-12 text-center text-muted-foreground">
            <p className="text-sm">該当するRecordがありません</p>
            <p className="text-xs mt-1">フィルター条件を変更してください</p>
          </div>
        )}
      </div>
    </section>
  )
}
