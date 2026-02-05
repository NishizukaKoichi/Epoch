"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import { useAuth } from "@/lib/auth/context"
import { EpochRecordForm } from "@/components/epoch-record-form"
import { EpochTimeline } from "@/components/epoch-timeline"
import { EpochStats } from "@/components/epoch-stats"
import { mapRecordToView, type EpochApiRecord, type EpochRecordView } from "@/lib/epoch/record-utils"

export function EpochDashboard() {
  const { userId } = useAuth()
  const [records, setRecords] = useState<EpochRecordView[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const loadRecords = useCallback(async () => {
    if (!userId) return
    setIsLoading(true)
    setError(null)
    try {
      const response = await fetch("/api/records/self")
      if (!response.ok) {
        const payload = await response.json().catch(() => null)
        throw new Error(payload?.error || "Failed to load records")
      }
      const data = (await response.json()) as { records: EpochApiRecord[] }
      const mapped = data.records.map(mapRecordToView)
      mapped.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      setRecords(mapped)
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to load records"
      setError(message)
    } finally {
      setIsLoading(false)
    }
  }, [userId])

  useEffect(() => {
    loadRecords()
  }, [loadRecords])

  const stats = useMemo(() => {
    const totalRecords = records.length
    const decisionsMade = records.filter((record) => record.type === "decision_made").length
    const decisionsNotMade = records.filter((record) => record.type === "decision_not_made").length
    const silencePeriods = records.filter((record) => record.type === "period_of_silence").length
    const oldest = records[records.length - 1]
    return {
      totalRecords,
      decisionsMade,
      decisionsNotMade,
      silencePeriods,
      memberSince: oldest?.timestamp ?? new Date().toISOString(),
    }
  }, [records])

  return (
    <>
      <EpochRecordForm userId={userId} onRecordCreated={loadRecords} />
      {error && (
        <div className="mb-4 rounded border border-destructive/30 bg-destructive/10 px-3 py-2 text-xs text-destructive">
          {error}
        </div>
      )}
      <EpochStats
        totalRecords={stats.totalRecords}
        decisionsMade={stats.decisionsMade}
        decisionsNotMade={stats.decisionsNotMade}
        silencePeriods={stats.silencePeriods}
        memberSince={stats.memberSince}
      />
      <EpochTimeline records={records} isLoading={isLoading} userId={userId ?? undefined} onRefresh={loadRecords} />
    </>
  )
}
