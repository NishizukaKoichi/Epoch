"use client"

import { useState } from "react"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { EpochHeader } from "@/components/epoch-header"
import { EpochFooter } from "@/components/epoch-footer"
import {
  Building2,
  Users,
  MapPin,
  Calendar,
  ChevronRight,
  Search,
  FileText,
  ExternalLink,
} from "@/components/icons"

interface PublicMember {
  id: string
  displayName: string
  department: string
  role: string
  recordCount: number
  joinedAt: string
}

interface EpochOrgPublicViewProps {
  orgId: string
}

// Mock data
const mockOrgInfo = {
  id: "org_pub_001",
  name: "株式会社テクノロジー",
  industry: "IT・ソフトウェア",
  location: "東京都",
  memberCount: 150,
  publicMemberCount: 42,
  foundedAt: "2015-04-01",
  description: "クラウドインフラストラクチャの開発・運用を行う企業です。",
}

const mockPublicMembers: PublicMember[] = [
  {
    id: "user_001",
    displayName: "田中 太郎",
    department: "エンジニアリング",
    role: "テックリード",
    recordCount: 156,
    joinedAt: "2018-04-01",
  },
  {
    id: "user_002",
    displayName: "佐藤 花子",
    department: "プロダクト",
    role: "プロダクトマネージャー",
    recordCount: 89,
    joinedAt: "2019-07-15",
  },
  {
    id: "user_003",
    displayName: "山田 一郎",
    department: "経営",
    role: "CTO",
    recordCount: 234,
    joinedAt: "2015-04-01",
  },
  {
    id: "user_004",
    displayName: "鈴木 美咲",
    department: "エンジニアリング",
    role: "シニアエンジニア",
    recordCount: 67,
    joinedAt: "2020-01-10",
  },
  {
    id: "user_005",
    displayName: "高橋 健太",
    department: "営業",
    role: "営業マネージャー",
    recordCount: 112,
    joinedAt: "2017-09-01",
  },
  {
    id: "user_006",
    displayName: "伊藤 裕子",
    department: "人事",
    role: "人事部長",
    recordCount: 78,
    joinedAt: "2016-06-01",
  },
]

const departments = ["すべて", "経営", "エンジニアリング", "プロダクト", "営業", "人事"]

export function EpochOrgPublicView({ orgId }: EpochOrgPublicViewProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [filterDepartment, setFilterDepartment] = useState("すべて")
  const [sortBy, setSortBy] = useState<"recordCount" | "name" | "joinedAt">("recordCount")

  const filteredMembers = mockPublicMembers
    .filter((member) => {
      if (searchQuery) {
        const query = searchQuery.toLowerCase()
        if (
          !member.displayName.toLowerCase().includes(query) &&
          !member.role.toLowerCase().includes(query)
        ) {
          return false
        }
      }
      if (filterDepartment !== "すべて" && member.department !== filterDepartment) {
        return false
      }
      return true
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "recordCount":
          return b.recordCount - a.recordCount
        case "name":
          return a.displayName.localeCompare(b.displayName)
        case "joinedAt":
          return new Date(b.joinedAt).getTime() - new Date(a.joinedAt).getTime()
        default:
          return 0
      }
    })

  return (
    <div className="min-h-screen bg-background">
      <EpochHeader />

      <main className="container max-w-5xl mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
          <Link href="/browse" className="hover:text-foreground transition-colors">
            一覧
          </Link>
          <ChevronRight className="h-4 w-4" />
          <Link href="/browse/orgs" className="hover:text-foreground transition-colors">
            組織
          </Link>
          <ChevronRight className="h-4 w-4" />
          <span className="text-foreground">{mockOrgInfo.name}</span>
        </div>

        {/* Organization Header */}
        <Card className="bg-card border-border mb-8">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-lg bg-secondary">
                <Building2 className="h-8 w-8 text-muted-foreground" />
              </div>
              <div className="flex-1">
                <h1 className="text-xl font-medium text-foreground mb-1">
                  {mockOrgInfo.name}
                </h1>
                <p className="text-sm text-muted-foreground mb-3">
                  {mockOrgInfo.description}
                </p>
                <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
                  <Badge variant="outline" className="border-border text-muted-foreground">
                    {mockOrgInfo.industry}
                  </Badge>
                  <span className="flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    {mockOrgInfo.location}
                  </span>
                  <span className="flex items-center gap-1">
                    <Users className="h-3 w-3" />
                    {mockOrgInfo.publicMemberCount} 人公開 / {mockOrgInfo.memberCount} 人
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {new Date(mockOrgInfo.foundedAt).getFullYear()}年設立
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Public Members Section */}
        <div className="mb-6">
          <h2 className="text-lg font-medium text-foreground mb-4">公開メンバー</h2>

          {/* Filters */}
          <div className="flex flex-wrap gap-3 mb-4">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="名前・役職で検索..."
                className="pl-10 bg-secondary border-border text-foreground"
              />
            </div>
            <Select
              value={filterDepartment}
              onValueChange={setFilterDepartment}
            >
              <SelectTrigger className="w-40 bg-secondary border-border text-foreground">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-card border-border">
                {departments.map((dept) => (
                  <SelectItem key={dept} value={dept} className="text-foreground">
                    {dept}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select
              value={sortBy}
              onValueChange={(v) => setSortBy(v as typeof sortBy)}
            >
              <SelectTrigger className="w-48 bg-secondary border-border text-foreground">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-card border-border">
                <SelectItem value="recordCount" className="text-foreground">
                  Record数（多い順）
                </SelectItem>
                <SelectItem value="name" className="text-foreground">
                  名前（A-Z）
                </SelectItem>
                <SelectItem value="joinedAt" className="text-foreground">
                  入社日（新しい順）
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Member count */}
          <p className="text-xs text-muted-foreground mb-4">
            {filteredMembers.length} 人の公開メンバー
          </p>

          {/* Members List */}
          <div className="space-y-2">
            {filteredMembers.map((member) => (
              <Link key={member.id} href={`/user/${member.id}`}>
                <Card className="bg-card border-border hover:border-muted-foreground/50 transition-colors cursor-pointer">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary">
                          <span className="text-sm font-medium text-foreground">
                            {member.displayName.charAt(0)}
                          </span>
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-foreground font-medium">
                              {member.displayName}
                            </span>
                            <Badge
                              variant="outline"
                              className="border-border text-muted-foreground text-xs"
                            >
                              {member.department}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">{member.role}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <div className="flex items-center gap-1 text-sm text-foreground">
                            <FileText className="h-3.5 w-3.5 text-muted-foreground" />
                            {member.recordCount}
                          </div>
                          <p className="text-xs text-muted-foreground">
                            {new Date(member.joinedAt).getFullYear()}年入社
                          </p>
                        </div>
                        <ExternalLink className="h-4 w-4 text-muted-foreground" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}

            {filteredMembers.length === 0 && (
              <div className="py-12 text-center">
                <Users className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
                <p className="text-sm text-muted-foreground">
                  該当するメンバーが見つかりません
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Note */}
        <div className="mt-8 p-4 border border-border rounded-md bg-muted/20">
          <p className="text-xs text-muted-foreground">
            各メンバーのEpochを閲覧するには、通常の閲覧と同様に課金が必要です。
            組織に所属しているという事実は公開されていますが、組織内の詳細な活動は各個人のEpochで確認してください。
          </p>
        </div>
      </main>

      <EpochFooter />
    </div>
  )
}
