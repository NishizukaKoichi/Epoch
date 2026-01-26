"use client"

import { useState, Suspense } from "react"
import Link from "next/link"
import { Search, Globe, BookOpen, Users, Download, Eye, ChevronRight } from "@/components/icons"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useI18n } from "@/lib/i18n/context"
import { useSearchParams } from "next/navigation"

// Mock data for public specifications
const publicSpecs = [
  {
    id: "remote-eng-team",
    name: "リモートエンジニアリングチーム",
    author: "TechCorp Inc.",
    purpose: "分散環境でプロダクト開発を効率的に進める",
    category: "engineering",
    chapters: 8,
    adoptedCount: 127,
    createdAt: "2025-11-15",
  },
  {
    id: "customer-success",
    name: "カスタマーサクセスチーム",
    author: "SaaS Solutions Ltd.",
    purpose: "顧客の成功を支援し、長期的な関係を構築する",
    category: "customer-success",
    chapters: 6,
    adoptedCount: 89,
    createdAt: "2025-12-01",
  },
  {
    id: "design-system-team",
    name: "デザインシステムチーム",
    author: "Design Studio Co.",
    purpose: "一貫したユーザー体験を提供するデザインシステムを構築・維持する",
    category: "design",
    chapters: 7,
    adoptedCount: 64,
    createdAt: "2025-10-20",
  },
  {
    id: "sales-team-b2b",
    name: "B2B営業チーム",
    author: "Enterprise Sales Inc.",
    purpose: "法人顧客との信頼関係を構築し、価値を提供する",
    category: "sales",
    chapters: 5,
    adoptedCount: 156,
    createdAt: "2025-09-10",
  },
  {
    id: "data-science-team",
    name: "データサイエンスチーム",
    author: "Analytics Corp.",
    purpose: "データに基づく意思決定を組織全体で推進する",
    category: "data",
    chapters: 6,
    adoptedCount: 43,
    createdAt: "2026-01-05",
  },
  {
    id: "product-management",
    name: "プロダクトマネジメント",
    author: "Product Leaders",
    purpose: "ユーザー価値とビジネス価値を最大化するプロダクトを作る",
    category: "product",
    chapters: 9,
    adoptedCount: 201,
    createdAt: "2025-08-22",
  },
]

const categories = [
  { id: "all", label: "すべて" },
  { id: "engineering", label: "エンジニアリング" },
  { id: "design", label: "デザイン" },
  { id: "product", label: "プロダクト" },
  { id: "sales", label: "営業" },
  { id: "customer-success", label: "カスタマーサクセス" },
  { id: "data", label: "データ" },
  { id: "hr", label: "人事" },
  { id: "finance", label: "経理・財務" },
]

function Loading() {
  return null;
}

export default function SigilExplorePage() {
  const { t } = useI18n()
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [adoptDialogOpen, setAdoptDialogOpen] = useState(false)
  const [selectedSpec, setSelectedSpec] = useState<typeof publicSpecs[0] | null>(null)
  const [adoptedSpecs, setAdoptedSpecs] = useState<string[]>([])

  const searchParams = useSearchParams();
  const categoryParam = searchParams.get("category") || "all";

  const filteredSpecs = publicSpecs.filter((spec) => {
    const matchesSearch =
      spec.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      spec.purpose.toLowerCase().includes(searchQuery.toLowerCase()) ||
      spec.author.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = categoryParam === "all" || spec.category === categoryParam
    return matchesSearch && matchesCategory
  })

  const handleAdoptClick = (spec: typeof publicSpecs[0]) => {
    setSelectedSpec(spec)
    setAdoptDialogOpen(true)
  }

  const handleAdoptConfirm = () => {
    if (selectedSpec) {
      setAdoptedSpecs((prev) => [...prev, selectedSpec.id])
    }
    setAdoptDialogOpen(false)
    setSelectedSpec(null)
  }

  return (
    <Suspense fallback={<Loading />}>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-semibold text-foreground">{t("sigil.explore.title")}</h1>
          <p className="text-sm text-muted-foreground mt-1">{t("sigil.explore.desc")}</p>
        </div>

        {/* Search and filters */}
        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t("sigil.explore.search")}
              className="pl-9"
            />
          </div>

          {/* Category filter */}
          <div className="flex gap-2 flex-wrap">
            {categories.map((category) => (
              <Button
                key={category.id}
                variant={categoryParam === category.id ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category.id)}
                className={categoryParam === category.id ? "" : "bg-transparent"}
              >
                {category.label}
              </Button>
            ))}
          </div>
        </div>

        {/* Results */}
        <div className="grid gap-4">
          {filteredSpecs.map((spec) => {
            const isAdopted = adoptedSpecs.includes(spec.id)
            return (
              <Card key={spec.id}>
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <CardTitle className="text-base flex items-center gap-2">
                        <Globe className="h-4 w-4 text-green-500 shrink-0" />
                        {spec.name}
                      </CardTitle>
                      <CardDescription className="mt-1">{spec.purpose}</CardDescription>
                    </div>
                    <div className="flex gap-2 shrink-0">
                      <Button
                        variant="outline"
                        size="sm"
                        asChild
                        className="bg-transparent"
                      >
                        <Link href={`/sigil/space/${spec.id}`}>
                          <Eye className="h-4 w-4 mr-1" />
                          {t("sigil.explore.view")}
                        </Link>
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => handleAdoptClick(spec)}
                        disabled={isAdopted}
                        variant={isAdopted ? "outline" : "default"}
                        className={isAdopted ? "bg-transparent" : ""}
                      >
                        <Download className="h-4 w-4 mr-1" />
                        {isAdopted ? t("sigil.explore.adopted") : t("sigil.explore.adopt")}
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Users className="h-3.5 w-3.5" />
                      {spec.author}
                    </span>
                    <span className="flex items-center gap-1">
                      <BookOpen className="h-3.5 w-3.5" />
                      {spec.chapters} {t("sigil.explore.chapters")}
                    </span>
                    <span className="flex items-center gap-1">
                      <Download className="h-3.5 w-3.5" />
                      {spec.adoptedCount}
                    </span>
                    <Badge variant="secondary" className="text-xs">
                      {categories.find((c) => c.id === spec.category)?.label || spec.category}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            )
          })}

          {filteredSpecs.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              該当する術式が見つかりませんでした
            </div>
          )}
        </div>

        {/* Adopt confirmation dialog */}
        <Dialog open={adoptDialogOpen} onOpenChange={setAdoptDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{t("sigil.explore.adopt_confirm")}</DialogTitle>
              <DialogDescription>{t("sigil.explore.adopt_desc")}</DialogDescription>
            </DialogHeader>
            {selectedSpec && (
              <div className="py-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">{selectedSpec.name}</CardTitle>
                    <CardDescription>{selectedSpec.purpose}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span>{selectedSpec.author}</span>
                      <span>{selectedSpec.chapters}章</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
            <DialogFooter>
              <Button variant="outline" onClick={() => setAdoptDialogOpen(false)} className="bg-transparent">
                キャンセル
              </Button>
              <Button onClick={handleAdoptConfirm}>
                <Download className="h-4 w-4 mr-1" />
                採用する
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </Suspense>
  )
}
