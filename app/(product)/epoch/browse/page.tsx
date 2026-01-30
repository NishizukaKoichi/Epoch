import { EpochHeader } from "@/components/epoch-header"
import { EpochUserDirectory } from "@/components/epoch-user-directory"
import { EpochFooter } from "@/components/epoch-footer"

export default function BrowsePage() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <EpochHeader />
      <main className="flex-1 container mx-auto px-4 py-8">
        <EpochUserDirectory />
      </main>
      <EpochFooter />
    </div>
  )
}
