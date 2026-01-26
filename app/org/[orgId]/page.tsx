import { EpochOrgDashboard } from "@/components/epoch-org-dashboard"

export default async function OrgDashboardPage({
  params,
}: {
  params: Promise<{ orgId: string }>
}) {
  const { orgId } = await params
  return <EpochOrgDashboard orgId={orgId} />
}
