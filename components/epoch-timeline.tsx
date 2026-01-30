"use client"

import { useState, useMemo } from "react"
import { EpochRecordCard } from "@/components/epoch-record-card"
import { EpochHashVerification } from "@/components/epoch-hash-verification"
import { EpochTimelineFilters, type RecordTypeFilter } from "@/components/epoch-timeline-filters"
import { Shield, ChevronDown, ChevronUp } from "@/components/icons"
import { Button } from "@/components/ui/button"
import type { EpochRecordView } from "@/lib/epoch/record-utils"

const RECORDS_PER_PAGE = 20

interface EpochTimelineProps {
  records: EpochRecordView[]
  isLoading: boolean
  userId?: string
  isOwner?: boolean
  onRefresh?: () => void
}

export function EpochTimeline({ records, isLoading, userId, isOwner, onRefresh }: EpochTimelineProps) {
  const resolvedIsOwner = isOwner ?? Boolean(userId)
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
    return records.filter((record) => {
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
  }, [filters, records])

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
        totalCount={records.length}
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
              userId={resolvedIsOwner ? userId : undefined}
              isOwner={resolvedIsOwner}
              onRecordChanged={onRefresh}
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

        {isLoading ? (
          <div className="py-12 text-center text-muted-foreground">
            <p className="text-sm">読み込み中...</p>
          </div>
        ) : filteredRecords.length === 0 && (
          <div className="py-12 text-center text-muted-foreground">
            <p className="text-sm">該当するRecordがありません</p>
            <p className="text-xs mt-1">フィルター条件を変更してください</p>
          </div>
        )}
      </div>
    </section>
  )
}
