"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
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
  displayName: string | null
  department: string | null
  role: string | null
  recordCount: number
  joinedAt: string | null
}

interface EpochOrgPublicViewProps {
  orgId: string
}

interface PublicOrganization {
  id: string
  name: string
  industry: string | null
  location: string | null
  memberCount: number
  publicMemberCount: number
  foundedAt: string | null
  description: string | null
}

export function EpochOrgPublicView({ orgId }: EpochOrgPublicViewProps) {
  const [orgInfo, setOrgInfo] = useState<PublicOrganization | null>(null)
  const [members, setMembers] = useState<PublicMember[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [filterDepartment, setFilterDepartment] = useState("すべて")
  const [sortBy, setSortBy] = useState<"recordCount" | "name" | "joinedAt">("recordCount")

  useEffect(() => {
    const load = async () => {
      setIsLoading(true)
      setError(null)
      try {
        const response = await fetch(`/api/epoch/orgs/${orgId}/public`)
        if (!response.ok) {
          const payload = await response.json().catch(() => null)
          throw new Error(payload?.error || "組織情報の取得に失敗しました")
        }
        const data = (await response.json()) as { org: PublicOrganization; members: PublicMember[] }
        setOrgInfo(data.org)
        setMembers(data.members ?? [])
      } catch (err) {
        const message = err instanceof Error ? err.message : "組織情報の取得に失敗しました"
        setError(message)
      } finally {
        setIsLoading(false)
      }
    }
    load()
  }, [orgId])

  const departments = useMemo(() => {
    const values = new Set<string>()
    for (const member of members) {
      if (member.department) {
        values.add(member.department)
      }
    }
    return ["すべて", ...Array.from(values)]
  }, [members])

  const filteredMembers = members
    .filter((member) => {
      if (searchQuery) {
        const query = searchQuery.toLowerCase()
        if (
          !(member.displayName ?? member.id).toLowerCase().includes(query) &&
          !(member.role ?? "").toLowerCase().includes(query)
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
          return (a.displayName ?? a.id).localeCompare(b.displayName ?? b.id)
        case "joinedAt":
          return new Date(b.joinedAt ?? 0).getTime() - new Date(a.joinedAt ?? 0).getTime()
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
          <Link href="/epoch/browse" className="hover:text-foreground transition-colors">
            一覧
          </Link>
          <ChevronRight className="h-4 w-4" />
          <Link href="/epoch/browse/orgs" className="hover:text-foreground transition-colors">
            組織
          </Link>
          <ChevronRight className="h-4 w-4" />
          <span className="text-foreground">{orgInfo?.name ?? "組織"}</span>
        </div>

        {error && (
          <div className="mb-6 rounded border border-destructive/30 bg-destructive/10 px-3 py-2 text-xs text-destructive">
            {error}
          </div>
        )}

        {isLoading && (
          <div className="mb-6 text-sm text-muted-foreground">読み込み中...</div>
        )}

        {/* Organization Header */}
        <Card className="bg-card border-border mb-8">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-lg bg-secondary">
                <Building2 className="h-8 w-8 text-muted-foreground" />
              </div>
              <div className="flex-1">
                <h1 className="text-xl font-medium text-foreground mb-1">
                  {orgInfo?.name ?? "組織名"}
                </h1>
                <p className="text-sm text-muted-foreground mb-3">
                  {orgInfo?.description ?? ""}
                </p>
                <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
                  <Badge variant="outline" className="border-border text-muted-foreground">
                    {orgInfo?.industry ?? "不明"}
                  </Badge>
                  <span className="flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    {orgInfo?.location ?? "不明"}
                  </span>
                  <span className="flex items-center gap-1">
                    <Users className="h-3 w-3" />
                    {orgInfo?.publicMemberCount ?? 0} 人公開 / {orgInfo?.memberCount ?? 0} 人
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {orgInfo?.foundedAt ? `${new Date(orgInfo.foundedAt).getFullYear()}年設立` : "設立年不明"}
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
              <Link key={member.id} href={`/epoch/user/${member.id}`}>
                <Card className="bg-card border-border hover:border-muted-foreground/50 transition-colors cursor-pointer">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary">
                          <span className="text-sm font-medium text-foreground">
                            {(member.displayName ?? member.id).charAt(0)}
                          </span>
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-foreground font-medium">
                              {member.displayName ?? member.id}
                            </span>
                            {member.department && (
                              <Badge
                                variant="outline"
                                className="border-border text-muted-foreground text-xs"
                              >
                                {member.department}
                              </Badge>
                            )}
                          </div>
                          {member.role && <p className="text-sm text-muted-foreground">{member.role}</p>}
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <div className="flex items-center gap-1 text-sm text-foreground">
                            <FileText className="h-3.5 w-3.5 text-muted-foreground" />
                            {member.recordCount}
                          </div>
                          <p className="text-xs text-muted-foreground">
                            {member.joinedAt ? `${new Date(member.joinedAt).getFullYear()}年入社` : "入社年不明"}
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
