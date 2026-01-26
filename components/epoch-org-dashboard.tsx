"use client"

import { useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { EpochHeader } from "@/components/epoch-header"
import { EpochFooter } from "@/components/epoch-footer"
import { EpochDepartmentTree } from "@/components/epoch-department-tree"
import {
  Building2,
  Users,
  Settings,
  FolderTree,
  Activity,
  ChevronRight,
} from "@/components/icons"
import type { Organization, Department, OrganizationMember } from "@/lib/types/organization"

interface EpochOrgDashboardProps {
  orgId: string
}

const mockOrg: Organization = {
  id: "org_001",
  name: "株式会社サンプル",
  slug: "sample-corp",
  createdAt: "2024-01-01T00:00:00Z",
  ownerId: "user_001",
  settings: {
    allowMemberEpochAccess: true,
    requireApprovalForJoin: true,
  },
}

const mockDepartments: Department[] = [
  { id: "dept_001", organizationId: "org_001", name: "経営", parentId: null, order: 0, createdAt: "2024-01-01" },
  { id: "dept_002", organizationId: "org_001", name: "人事部", parentId: null, order: 1, createdAt: "2024-01-01" },
  { id: "dept_003", organizationId: "org_001", name: "営業部", parentId: null, order: 2, createdAt: "2024-01-01" },
  { id: "dept_004", organizationId: "org_001", name: "開発部", parentId: null, order: 3, createdAt: "2024-01-01" },
  { id: "dept_005", organizationId: "org_001", name: "採用課", parentId: "dept_002", order: 0, createdAt: "2024-01-01" },
  { id: "dept_006", organizationId: "org_001", name: "労務課", parentId: "dept_002", order: 1, createdAt: "2024-01-01" },
  { id: "dept_007", organizationId: "org_001", name: "国内営業", parentId: "dept_003", order: 0, createdAt: "2024-01-01" },
  { id: "dept_008", organizationId: "org_001", name: "海外営業", parentId: "dept_003", order: 1, createdAt: "2024-01-01" },
  { id: "dept_009", organizationId: "org_001", name: "フロントエンド", parentId: "dept_004", order: 0, createdAt: "2024-01-01" },
  { id: "dept_010", organizationId: "org_001", name: "バックエンド", parentId: "dept_004", order: 1, createdAt: "2024-01-01" },
  { id: "dept_011", organizationId: "org_001", name: "インフラ", parentId: "dept_004", order: 2, createdAt: "2024-01-01" },
]

const mockStats = {
  totalMembers: 128,
  totalRecords: 4521,
  activeToday: 45,
  departments: 11,
}

export function EpochOrgDashboard({ orgId }: EpochOrgDashboardProps) {
  const [selectedDepartment, setSelectedDepartment] = useState<string | null>(null)

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <EpochHeader />

      <main className="flex-1 container max-w-6xl mx-auto px-4 py-8">
        {/* Org Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-md bg-secondary">
              <Building2 className="h-6 w-6 text-muted-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-foreground">{mockOrg.name}</h1>
              <p className="text-sm text-muted-foreground font-mono">/{mockOrg.slug}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link href={`/org/${orgId}/members`}>
              <Button variant="outline" className="border-border bg-transparent">
                <Users className="h-4 w-4 mr-2" />
                メンバー
              </Button>
            </Link>
            <Link href={`/org/${orgId}/settings`}>
              <Button variant="outline" className="border-border bg-transparent">
                <Settings className="h-4 w-4 mr-2" />
                設定
              </Button>
            </Link>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-4 mb-8">
          <Card className="bg-card border-border">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Users className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-2xl font-semibold text-foreground">{mockStats.totalMembers}</p>
                  <p className="text-xs text-muted-foreground">メンバー</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-card border-border">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Activity className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-2xl font-semibold text-foreground">{mockStats.totalRecords}</p>
                  <p className="text-xs text-muted-foreground">総Record数</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-card border-border">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Activity className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-2xl font-semibold text-foreground">{mockStats.activeToday}</p>
                  <p className="text-xs text-muted-foreground">本日のアクティブ</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-card border-border">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <FolderTree className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-2xl font-semibold text-foreground">{mockStats.departments}</p>
                  <p className="text-xs text-muted-foreground">部門数</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-3 gap-6">
          {/* Department Tree */}
          <div className="col-span-1">
            <Card className="bg-card border-border">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-foreground flex items-center gap-2">
                  <FolderTree className="h-4 w-4" />
                  部門構造
                </CardTitle>
              </CardHeader>
              <CardContent>
                <EpochDepartmentTree
                  departments={mockDepartments}
                  selectedId={selectedDepartment}
                  onSelect={setSelectedDepartment}
                  orgId={orgId}
                />
              </CardContent>
            </Card>
          </div>

          {/* Department Members / Recent Activity */}
          <div className="col-span-2">
            <Card className="bg-card border-border">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-foreground">
                  {selectedDepartment
                    ? mockDepartments.find((d) => d.id === selectedDepartment)?.name + " のメンバー"
                    : "最近のアクティビティ"
                  }
                </CardTitle>
              </CardHeader>
              <CardContent>
                {selectedDepartment ? (
                  <DepartmentMembersList departmentId={selectedDepartment} orgId={orgId} />
                ) : (
                  <RecentOrgActivity />
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="mt-6 p-4 bg-secondary/50 border border-border rounded-md">
          <p className="text-xs text-muted-foreground leading-relaxed">
            組織内のRecordは各メンバーの個人Epochとして記録されます。
            組織設定により、メンバー間での閲覧権限を制御できます。
            すべてのRecordは不可逆であり、組織管理者であっても削除・編集はできません。
          </p>
        </div>
      </main>

      <EpochFooter />
    </div>
  )
}

function DepartmentMembersList({ departmentId, orgId }: { departmentId: string; orgId: string }) {
  const mockMembers: OrganizationMember[] = [
    { id: "m1", organizationId: orgId, userId: "u1", departmentId, role: "manager", joinedAt: "2024-01-01", displayName: "田中 太郎" },
    { id: "m2", organizationId: orgId, userId: "u2", departmentId, role: "member", joinedAt: "2024-02-01", displayName: "佐藤 花子" },
    { id: "m3", organizationId: orgId, userId: "u3", departmentId, role: "member", joinedAt: "2024-03-01", displayName: "鈴木 一郎" },
  ]

  const ROLE_LABELS = {
    owner: "オーナー",
    admin: "管理者",
    manager: "マネージャー",
    member: "メンバー",
  }

  return (
    <div className="space-y-2">
      {mockMembers.map((member) => (
        <Link key={member.id} href={`/user/${member.userId}`}>
          <div className="flex items-center justify-between p-3 rounded-md hover:bg-secondary/50 transition-colors cursor-pointer">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-full bg-secondary flex items-center justify-center">
                <span className="text-xs text-muted-foreground">
                  {member.displayName.slice(0, 1)}
                </span>
              </div>
              <div>
                <p className="text-sm text-foreground">{member.displayName}</p>
                <p className="text-xs text-muted-foreground">{ROLE_LABELS[member.role]}</p>
              </div>
            </div>
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
          </div>
        </Link>
      ))}
    </div>
  )
}

function RecentOrgActivity() {
  const activities = [
    { id: 1, user: "田中 太郎", action: "Recordを作成", time: "5分前", type: "decision_made" },
    { id: 2, user: "佐藤 花子", action: "改訂を追加", time: "12分前", type: "revision" },
    { id: 3, user: "鈴木 一郎", action: "Recordを作成", time: "30分前", type: "decision_not_made" },
    { id: 4, user: "山田 次郎", action: "参加", time: "1時間前", type: "joined" },
    { id: 5, user: "高橋 三郎", action: "Recordを作成", time: "2時間前", type: "decision_made" },
  ]

  return (
    <div className="space-y-2">
      {activities.map((activity) => (
        <div
          key={activity.id}
          className="flex items-center justify-between p-3 border-b border-border last:border-0"
        >
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-full bg-secondary flex items-center justify-center">
              <span className="text-xs text-muted-foreground">
                {activity.user.slice(0, 1)}
              </span>
            </div>
            <div>
              <p className="text-sm text-foreground">
                <span className="font-medium">{activity.user}</span>
                <span className="text-muted-foreground ml-2">{activity.action}</span>
              </p>
            </div>
          </div>
          <span className="text-xs text-muted-foreground">{activity.time}</span>
        </div>
      ))}
    </div>
  )
}
