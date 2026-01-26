import { EpochOrgSettings } from "@/components/epoch-org-settings"

export default async function OrgSettingsPage({
  params,
}: {
  params: Promise<{ orgId: string }>
}) {
  const { orgId } = await params
  return <EpochOrgSettings orgId={orgId} />
}
