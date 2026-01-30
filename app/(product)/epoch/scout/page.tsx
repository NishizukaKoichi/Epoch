import { EpochHeader } from "@/components/epoch-header"
import { EpochScoutInbox } from "@/components/epoch-scout-inbox"

export default function ScoutPage() {
  return (
    <div className="min-h-screen bg-background">
      <EpochHeader />
      <main className="mx-auto max-w-4xl px-4 py-8">
        <EpochScoutInbox />
      </main>
    </div>
  )
}
