"use client"

import { useState } from "react"
import Link from "next/link"
import { Plus, FolderOpen, Users, FileText, Edit, Eye, Globe, Building2, Lock } from "@/components/icons"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useI18n } from "@/lib/i18n/context"

// Mock data for spaces - this would come from a database in a real app
const mockSpaces = [
  {
    id: "eng-team",
    name: "Engineering Team",
    purpose: "プロダクト開発を通じて価値を届ける",
    visibility: "internal" as const,
    chaptersCount: 6,
    viewsCount: 543,
    lastUpdated: "2026-01-20",
  },
  {
    id: "design-team", 
    name: "Design Team",
    purpose: "ユーザー体験を設計する",
    visibility: "public" as const,
    chaptersCount: 5,
    viewsCount: 321,
    lastUpdated: "2026-01-18",
  },
  {
    id: "sales-team",
    name: "Sales Team",
    purpose: "顧客との信頼関係を構築する",
    visibility: "private" as const,
    chaptersCount: 4,
    viewsCount: 187,
    lastUpdated: "2026-01-15",
  },
]

const getVisibilityBadge = (visibility: "public" | "internal" | "private") => {
  switch (visibility) {
    case "public":
      return (
        <Badge variant="secondary" className="gap-1">
          <Globe className="h-3 w-3 text-green-500" />
          公開
        </Badge>
      )
    case "internal":
      return (
        <Badge variant="secondary" className="gap-1">
          <Building2 className="h-3 w-3 text-amber-500" />
          社内限定
        </Badge>
      )
    case "private":
      return (
        <Badge variant="secondary" className="gap-1">
          <Lock className="h-3 w-3" />
          非公開
        </Badge>
      )
  }
}

export default function SigilDashboardPage() {
  const { t } = useI18n()
  const [spaces] = useState(mockSpaces)

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">
            {t("sigil.dashboard")}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {t("sigil.spaces_desc")}
          </p>
        </div>
        <Link href="/sigil/spaces/new">
          <Button className="bg-amber-500 hover:bg-amber-600 text-background">
            <Plus className="mr-2 h-4 w-4" />
            {t("sigil.create_space")}
          </Button>
        </Link>
      </div>

      {/* Spaces Grid */}
      {spaces.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <FolderOpen className="h-12 w-12 text-muted-foreground/50" />
            <p className="mt-4 text-sm text-muted-foreground">
              {t("sigil.no_spaces")}
            </p>
            <Link href="/sigil/spaces/new">
              <Button className="mt-4 bg-amber-500 hover:bg-amber-600 text-background">
                <Plus className="mr-2 h-4 w-4" />
                {t("sigil.create_space")}
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {spaces.map((space) => (
            <Card key={space.id} className="group hover:border-amber-500/50 transition-colors">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <CardTitle className="text-lg">{space.name}</CardTitle>
                      {getVisibilityBadge(space.visibility)}
                    </div>
                    <CardDescription>
                      {space.purpose}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1.5">
                    <FileText className="h-4 w-4" />
                    <span>{space.chaptersCount}章</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Users className="h-4 w-4" />
                    <span>{space.viewsCount} views</span>
                  </div>
                </div>
                <div className="mt-4 flex items-center justify-between">
                  <p className="text-xs text-muted-foreground">
                    更新: {space.lastUpdated}
                  </p>
                  <div className="flex items-center gap-2">
                    <Link href={`/sigil/space/${space.id}`}>
                      <Button variant="ghost" size="sm" className="gap-1 h-8">
                        <Eye className="h-3 w-3" />
                        表示
                      </Button>
                    </Link>
                    <Link href={`/sigil/spaces/${space.id}/edit`}>
                      <Button variant="outline" size="sm" className="gap-1 h-8 bg-transparent">
                        <Edit className="h-3 w-3" />
                        編集
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
