import { EpochTimeline } from "@/components/epoch-timeline"
import { EpochHeader } from "@/components/epoch-header"
import { EpochRecordForm } from "@/components/epoch-record-form"
import { EpochOfflineBanner } from "@/components/epoch-offline-banner"
import { EpochStats } from "@/components/epoch-stats"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <EpochHeader />
      <main className="mx-auto max-w-4xl px-4 py-8">
        <EpochRecordForm />
        <EpochStats
          totalRecords={5}
          decisionsMade={2}
          decisionsNotMade={1}
          silencePeriods={1}
          memberSince="2024-07-28T00:00:00Z"
        />
        <EpochTimeline />
      </main>
      <EpochOfflineBanner />
    </div>
  )
}
