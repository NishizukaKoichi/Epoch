import { EpochHeader } from "@/components/epoch-header"
import { EpochUserView } from "@/components/epoch-user-epoch-view"
import { EpochOfflineBanner } from "@/components/epoch-offline-banner"
import { EpochFooter } from "@/components/epoch-footer"

// Mock user data
const mockUser = {
  userId: "01J5QKXR8V0000000000000099",
  displayName: "田中 太郎",
  bio: "判断の履歴を残しています。プロダクト開発とチームマネジメントに興味があります。",
  avatarUrl: null,
  createdAt: "2024-01-15T00:00:00Z",
  links: [
    { id: "link_1", type: "github" as const, url: "https://github.com/tanaka" },
    { id: "link_2", type: "linkedin" as const, url: "https://linkedin.com/in/tanaka" },
    { id: "link_3", type: "twitter" as const, url: "https://x.com/tanaka" },
    { id: "link_4", type: "blog" as const, url: "https://blog.tanaka.dev", label: "Tech Blog" },
  ],
}

export default async function UserEpochPage({
  params,
}: {
  params: Promise<{ userId: string }>
}) {
  const { userId } = await params

  // In production, fetch user data and check access from database
  const initialHasAccess = false

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <EpochHeader />
      <main className="flex-1">
        <EpochUserView user={{ ...mockUser, userId }} initialHasAccess={initialHasAccess} />
      </main>
      <EpochFooter />
      <EpochOfflineBanner />
    </div>
  )
}
