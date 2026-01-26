"use client"

import { useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { EpochHeader } from "@/components/epoch-header"
import { EpochFooter } from "@/components/epoch-footer"
import {
  Search,
  UserPlus,
  MoreHorizontal,
  ChevronRight,
  Mail,
  Shield,
  UserMinus,
  Building2,
  ArrowLeft,
} from "@/components/icons"
import type { OrganizationMember, Department, OrganizationRole } from "@/lib/types/organization"

interface EpochOrgMembersProps {
  orgId: string
}

const mockDepartments: Department[] = [
  { id: "dept_001", organizationId: "org_001", name: "経営", parentId: null, order: 0, createdAt: "2024-01-01" },
  { id: "dept_002", organizationId: "org_001", name: "人事部", parentId: null, order: 1, createdAt: "2024-01-01" },
  { id: "dept_003", organizationId: "org_001", name: "営業部", parentId: null, order: 2, createdAt: "2024-01-01" },
  { id: "dept_004", organizationId: "org_001", name: "開発部", parentId: null, order: 3, createdAt: "2024-01-01" },
]

const mockMembers: OrganizationMember[] = [
  { id: "m1", organizationId: "org_001", userId: "u1", departmentId: "dept_001", role: "owner", joinedAt: "2024-01-01", displayName: "山本 社長" },
  { id: "m2", organizationId: "org_001", userId: "u2", departmentId: "dept_001", role: "admin", joinedAt: "2024-01-01", displayName: "鈴木 副社長" },
  { id: "m3", organizationId: "org_001", userId: "u3", departmentId: "dept_002", role: "manager", joinedAt: "2024-01-15", displayName: "田中 人事部長" },
  { id: "m4", organizationId: "org_001", userId: "u4", departmentId: "dept_002", role: "member", joinedAt: "2024-02-01", displayName: "佐藤 花子" },
  { id: "m5", organizationId: "org_001", userId: "u5", departmentId: "dept_003", role: "manager", joinedAt: "2024-01-10", displayName: "高橋 営業部長" },
  { id: "m6", organizationId: "org_001", userId: "u6", departmentId: "dept_003", role: "member", joinedAt: "2024-02-15", displayName: "伊藤 一郎" },
  { id: "m7", organizationId: "org_001", userId: "u7", departmentId: "dept_004", role: "manager", joinedAt: "2024-01-05", displayName: "渡辺 開発部長" },
  { id: "m8", organizationId: "org_001", userId: "u8", departmentId: "dept_004", role: "member", joinedAt: "2024-03-01", displayName: "小林 エンジニア" },
]

const ROLE_LABELS: Record<OrganizationRole, string> = {
  owner: "オーナー",
  admin: "管理者",
  manager: "マネージャー",
  member: "メンバー",
}

export function EpochOrgMembers({ orgId }: EpochOrgMembersProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [filterDepartment, setFilterDepartment] = useState<string | null>(null)
  const [filterRole, setFilterRole] = useState<OrganizationRole | null>(null)
  const [inviteDialogOpen, setInviteDialogOpen] = useState(false)
  const [inviteEmail, setInviteEmail] = useState("")
  const [inviteRole, setInviteRole] = useState<OrganizationRole>("member")
  const [inviteDepartment, setInviteDepartment] = useState<string | null>(null)

  const filteredMembers = mockMembers.filter((member) => {
    if (searchQuery && !member.displayName.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false
    }
    if (filterDepartment && member.departmentId !== filterDepartment) {
      return false
    }
    if (filterRole && member.role !== filterRole) {
      return false
    }
    return true
  })

  const handleInvite = () => {
    console.log("Inviting:", { email: inviteEmail, role: inviteRole, departmentId: inviteDepartment })
    setInviteDialogOpen(false)
    setInviteEmail("")
    setInviteRole("member")
    setInviteDepartment(null)
  }

  const getDepartmentName = (deptId: string | null) => {
    if (!deptId) return "未配属"
    return mockDepartments.find((d) => d.id === deptId)?.name || "不明"
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <EpochHeader />

      <main className="flex-1 container max-w-4xl mx-auto px-4 py-8">
        <div className="mb-6">
          <Link
            href={`/org/${orgId}`}
            className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1"
          >
            <ArrowLeft className="h-4 w-4" />
            組織ダッシュボードに戻る
          </Link>
        </div>

        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-xl font-semibold text-foreground">メンバー管理</h1>
            <p className="text-sm text-muted-foreground mt-1">
              {mockMembers.length} 名のメンバー
            </p>
          </div>

          <Button
            onClick={() => setInviteDialogOpen(true)}
            className="bg-primary text-primary-foreground hover:bg-primary/90"
          >
            <UserPlus className="h-4 w-4 mr-2" />
            招待
          </Button>
        </div>

        {/* Filters */}
        <Card className="bg-card border-border mb-6">
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="名前で検索..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 bg-secondary border-border text-foreground"
                />
              </div>

              <Select
                value={filterDepartment || "all"}
                onValueChange={(v) => setFilterDepartment(v === "all" ? null : v)}
              >
                <SelectTrigger className="w-40 bg-secondary border-border text-foreground">
                  <SelectValue placeholder="部門" />
                </SelectTrigger>
                <SelectContent className="bg-card border-border">
                  <SelectItem value="all" className="text-foreground">すべての部門</SelectItem>
                  {mockDepartments.map((dept) => (
                    <SelectItem key={dept.id} value={dept.id} className="text-foreground">
                      {dept.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select
                value={filterRole || "all"}
                onValueChange={(v) => setFilterRole(v === "all" ? null : (v as OrganizationRole))}
              >
                <SelectTrigger className="w-40 bg-secondary border-border text-foreground">
                  <SelectValue placeholder="役割" />
                </SelectTrigger>
                <SelectContent className="bg-card border-border">
                  <SelectItem value="all" className="text-foreground">すべての役割</SelectItem>
                  <SelectItem value="owner" className="text-foreground">オーナー</SelectItem>
                  <SelectItem value="admin" className="text-foreground">管理者</SelectItem>
                  <SelectItem value="manager" className="text-foreground">マネージャー</SelectItem>
                  <SelectItem value="member" className="text-foreground">メンバー</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Members List */}
        <Card className="bg-card border-border">
          <CardContent className="p-0">
            <div className="divide-y divide-border">
              {filteredMembers.map((member) => (
                <div
                  key={member.id}
                  className="flex items-center justify-between p-4 hover:bg-secondary/30 transition-colors"
                >
                  <Link href={`/user/${member.userId}`} className="flex items-center gap-3 flex-1">
                    <div className="h-10 w-10 rounded-full bg-secondary flex items-center justify-center">
                      <span className="text-sm text-muted-foreground">
                        {member.displayName.slice(0, 1)}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">{member.displayName}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          <Building2 className="h-3 w-3" />
                          {getDepartmentName(member.departmentId)}
                        </span>
                        <span className="text-xs px-1.5 py-0.5 bg-secondary rounded text-muted-foreground">
                          {ROLE_LABELS[member.role]}
                        </span>
                      </div>
                    </div>
                  </Link>

                  <div className="flex items-center gap-2">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="bg-card border-border">
                        <DropdownMenuItem className="text-foreground">
                          <ChevronRight className="h-4 w-4 mr-2" />
                          Epochを見る
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-foreground">
                          <Shield className="h-4 w-4 mr-2" />
                          役割を変更
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-foreground">
                          <Building2 className="h-4 w-4 mr-2" />
                          部門を変更
                        </DropdownMenuItem>
                        <DropdownMenuSeparator className="bg-border" />
                        <DropdownMenuItem className="text-destructive">
                          <UserMinus className="h-4 w-4 mr-2" />
                          組織から削除
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {filteredMembers.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            <p>該当するメンバーがいません</p>
          </div>
        )}

        {/* Invite Dialog */}
        <Dialog open={inviteDialogOpen} onOpenChange={setInviteDialogOpen}>
          <DialogContent className="bg-card border-border">
            <DialogHeader>
              <DialogTitle className="text-foreground">メンバーを招待</DialogTitle>
              <DialogDescription className="text-muted-foreground">
                メールアドレスを入力して招待を送信します。
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="invite-email" className="text-foreground">メールアドレス</Label>
                <Input
                  id="invite-email"
                  type="email"
                  placeholder="example@company.com"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  className="bg-secondary border-border text-foreground"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="invite-role" className="text-foreground">役割</Label>
                <Select value={inviteRole} onValueChange={(v) => setInviteRole(v as OrganizationRole)}>
                  <SelectTrigger className="bg-secondary border-border text-foreground">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-card border-border">
                    <SelectItem value="admin" className="text-foreground">管理者</SelectItem>
                    <SelectItem value="manager" className="text-foreground">マネージャー</SelectItem>
                    <SelectItem value="member" className="text-foreground">メンバー</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="invite-dept" className="text-foreground">配属部門</Label>
                <Select
                  value={inviteDepartment || "later"}
                  onValueChange={(v) => setInviteDepartment(v === "later" ? null : v)}
                >
                  <SelectTrigger className="bg-secondary border-border text-foreground">
                    <SelectValue placeholder="後で設定" />
                  </SelectTrigger>
                  <SelectContent className="bg-card border-border">
                    <SelectItem value="later" className="text-foreground">後で設定</SelectItem>
                    {mockDepartments.map((dept) => (
                      <SelectItem key={dept.id} value={dept.id} className="text-foreground">
                        {dept.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setInviteDialogOpen(false)}
                className="border-border bg-transparent"
              >
                キャンセル
              </Button>
              <Button
                onClick={handleInvite}
                disabled={!inviteEmail}
                className="bg-primary text-primary-foreground"
              >
                <Mail className="h-4 w-4 mr-2" />
                招待を送信
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </main>

      <EpochFooter />
    </div>
  )
}
