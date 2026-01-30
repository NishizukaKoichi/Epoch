import { EpochScoutConversation } from "@/components/epoch-scout-conversation"
import { EpochHeader } from "@/components/epoch-header"
import { EpochFooter } from "@/components/epoch-footer"

export default async function ScoutConversationPage({
  params,
}: {
  params: Promise<{ scoutId: string }>
}) {
  const { scoutId } = await params

  return (
    <div className="min-h-screen bg-background">
      <EpochHeader />
      <main className="container max-w-3xl mx-auto px-4 py-8">
        <EpochScoutConversation conversationId={scoutId} />
      </main>
      <EpochFooter />
    </div>
  )
}
