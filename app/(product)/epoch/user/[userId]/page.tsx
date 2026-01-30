import { EpochHeader } from "@/components/epoch-header"
import { EpochUserView } from "@/components/epoch-user-epoch-view"
import { EpochOfflineBanner } from "@/components/epoch-offline-banner"
import { EpochFooter } from "@/components/epoch-footer"

export default async function UserEpochPage({
  params,
}: {
  params: Promise<{ userId: string }>
}) {
  const { userId } = await params

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <EpochHeader />
      <main className="flex-1">
        <EpochUserView userId={userId} />
      </main>
      <EpochFooter />
      <EpochOfflineBanner />
    </div>
  )
}
