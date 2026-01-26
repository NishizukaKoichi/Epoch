import { EpochOrgPublicView } from "@/components/epoch-org-public-view"

interface PageProps {
  params: Promise<{ orgId: string }>
}

export default async function OrgPublicPage({ params }: PageProps) {
  const { orgId } = await params
  return <EpochOrgPublicView orgId={orgId} />
}
