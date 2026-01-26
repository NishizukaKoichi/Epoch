export interface Organization {
  id: string
  name: string
  slug: string
  createdAt: string
  ownerId: string
  settings: {
    allowMemberEpochAccess: boolean // メンバー間でEpoch閲覧可能か
    requireApprovalForJoin: boolean // 参加に承認が必要か
  }
}

export interface Department {
  id: string
  organizationId: string
  name: string
  parentId: string | null // nullならルート部門
  order: number
  createdAt: string
}

export interface OrganizationMember {
  id: string
  organizationId: string
  userId: string
  departmentId: string | null
  role: "owner" | "admin" | "manager" | "member"
  joinedAt: string
  displayName: string
  avatarUrl?: string
}

export interface OrganizationInvite {
  id: string
  organizationId: string
  departmentId: string | null
  email: string
  role: "admin" | "manager" | "member"
  invitedBy: string
  createdAt: string
  expiresAt: string
  status: "pending" | "accepted" | "declined" | "expired"
}

export type OrganizationRole = OrganizationMember["role"]

export const ROLE_LABELS: Record<OrganizationRole, string> = {
  owner: "オーナー",
  admin: "管理者",
  manager: "マネージャー",
  member: "メンバー",
}

export const ROLE_PERMISSIONS: Record<OrganizationRole, {
  canManageOrg: boolean
  canManageDepartments: boolean
  canInviteMembers: boolean
  canViewAllEpochs: boolean
}> = {
  owner: {
    canManageOrg: true,
    canManageDepartments: true,
    canInviteMembers: true,
    canViewAllEpochs: true,
  },
  admin: {
    canManageOrg: true,
    canManageDepartments: true,
    canInviteMembers: true,
    canViewAllEpochs: true,
  },
  manager: {
    canManageOrg: false,
    canManageDepartments: false,
    canInviteMembers: true,
    canViewAllEpochs: false, // 自部門のみ
  },
  member: {
    canManageOrg: false,
    canManageDepartments: false,
    canInviteMembers: false,
    canViewAllEpochs: false,
  },
}
