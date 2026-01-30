import { EpochHeader } from "@/components/epoch-header"
import { EpochProfileSettings } from "@/components/epoch-profile-settings"
import { EpochOfflineBanner } from "@/components/epoch-offline-banner"

export default function ProfilePage() {
  return (
    <div className="min-h-screen bg-background">
      <EpochHeader />
      <main className="mx-auto max-w-4xl px-4 py-8">
        <EpochProfileSettings />
      </main>
      <EpochOfflineBanner />
    </div>
  )
}
