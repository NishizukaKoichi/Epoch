import { EpochHeader } from "@/components/epoch-header"
import { EpochSettingsPage } from "@/components/epoch-settings-page"

export default function SettingsPage() {
  return (
    <div className="min-h-screen bg-background">
      <EpochHeader />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <EpochSettingsPage />
      </main>
    </div>
  )
}
