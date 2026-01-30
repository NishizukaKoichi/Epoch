import { EpochHeader } from "@/components/epoch-header"
import { EpochOfflineBanner } from "@/components/epoch-offline-banner"
import { EpochDashboard } from "@/components/epoch-dashboard"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <EpochHeader />
      <main className="mx-auto max-w-4xl px-4 py-8">
        <EpochDashboard />
      </main>
      <EpochOfflineBanner />
    </div>
  )
}
