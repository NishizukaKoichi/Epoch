import { EpochOrgMembers } from "@/components/epoch-org-members"

export default async function OrgMembersPage({
  params,
}: {
  params: Promise<{ orgId: string }>
}) {
  const { orgId } = await params
  return <EpochOrgMembers orgId={orgId} />
}
