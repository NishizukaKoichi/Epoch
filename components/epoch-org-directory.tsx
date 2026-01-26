"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { EpochHeader } from "@/components/epoch-header"
import { EpochFooter } from "@/components/epoch-footer"
import {
  Search,
  Building2,
  Users,
  MapPin,
  Calendar,
  ChevronRight,
  Filter,
  X,
  LayoutGrid,
  List,
} from "@/components/icons"

interface PublicOrganization {
  id: string
  name: string
  industry: string
  location: string
  memberCount: number
  publicMemberCount: number
  foundedAt: string
  description?: string
}

const mockOrganizations: PublicOrganization[] = [
  {
    id: "org_pub_001",
    name: "株式会社テクノロジー",
    industry: "IT・ソフトウェア",
    location: "日本",
    memberCount: 150,
    publicMemberCount: 42,
    foundedAt: "2015-04-01",
    description: "クラウドインフラストラクチャの開発・運用",
  },
  {
    id: "org_pub_002",
    name: "TechVentures Inc.",
    industry: "IT・ソフトウェア",
    location: "アメリカ",
    memberCount: 85,
    publicMemberCount: 52,
    foundedAt: "2018-03-01",
    description: "AI/ML Platform Development",
  },
  {
    id: "org_pub_003",
    name: "Deutsche Industrie GmbH",
    industry: "製造",
    location: "ドイツ",
    memberCount: 1200,
    publicMemberCount: 180,
    foundedAt: "1952-08-20",
    description: "Precision Engineering & Manufacturing",
  },
  {
    id: "org_pub_004",
    name: "Singapore Consulting Pte Ltd",
    industry: "コンサルティング",
    location: "シンガポール",
    memberCount: 80,
    publicMemberCount: 45,
    foundedAt: "2012-06-01",
    description: "APAC Strategy & Digital Transformation",
  },
  {
    id: "org_pub_005",
    name: "グローバル商事株式会社",
    industry: "商社",
    location: "日本",
    memberCount: 2000,
    publicMemberCount: 320,
    foundedAt: "1960-03-10",
  },
  {
    id: "org_pub_006",
    name: "Creative Studio London",
    industry: "デザイン・クリエイティブ",
    location: "イギリス",
    memberCount: 25,
    publicMemberCount: 22,
    foundedAt: "2019-11-01",
    description: "Brand Identity & Digital Design",
  },
  {
    id: "org_pub_007",
    name: "金融サービス株式会社",
    industry: "金融",
    location: "日本",
    memberCount: 800,
    publicMemberCount: 95,
    foundedAt: "1998-02-15",
  },
  {
    id: "org_pub_008",
    name: "HealthTech India Pvt Ltd",
    industry: "医療・ヘルスケア",
    location: "インド",
    memberCount: 120,
    publicMemberCount: 68,
    foundedAt: "2020-05-01",
    description: "Telemedicine & Rural Healthcare",
  },
  {
    id: "org_pub_009",
    name: "Nordic Fintech AB",
    industry: "金融",
    location: "スウェーデン",
    memberCount: 45,
    publicMemberCount: 38,
    foundedAt: "2019-01-15",
    description: "Open Banking Solutions",
  },
  {
    id: "org_pub_010",
    name: "São Paulo Tech Ltda",
    industry: "IT・ソフトウェア",
    location: "ブラジル",
    memberCount: 65,
    publicMemberCount: 42,
    foundedAt: "2017-07-01",
    description: "E-commerce & Payments",
  },
  {
    id: "org_pub_011",
    name: "Dubai Investments LLC",
    industry: "金融",
    location: "UAE",
    memberCount: 200,
    publicMemberCount: 55,
    foundedAt: "2008-04-01",
  },
  {
    id: "org_pub_012",
    name: "Beijing AI Research",
    industry: "IT・ソフトウェア",
    location: "中国",
    memberCount: 350,
    publicMemberCount: 120,
    foundedAt: "2016-09-01",
    description: "Computer Vision & NLP Research",
  },
]

// Comprehensive industry categories
const industryCategories: Record<string, string[]> = {
  "情報・通信": [
    "IT・ソフトウェア",
    "通信",
    "インターネットサービス",
    "ゲーム",
    "メディア・出版",
    "広告・マーケティング",
  ],
  "製造・建設": [
    "製造",
    "自動車",
    "電機・精密機器",
    "化学・素材",
    "建設",
    "住宅・インテリア",
  ],
  "流通・小売": [
    "商社",
    "小売",
    "EC・通販",
    "卸売",
    "物流・運輸",
  ],
  "飲食・サービス": [
    "飲食",
    "ホテル・宿泊",
    "旅行・観光",
    "美容・理容",
    "冠婚葬祭",
    "レジャー・娯楽",
    "人材サービス",
    "警備・清掃",
  ],
  "金融・不動産": [
    "金融",
    "銀行",
    "証券",
    "保険",
    "不動産",
    "投資・ファンド",
  ],
  "専門サービス": [
    "コンサルティング",
    "法律・会計",
    "デザイン・クリエイティブ",
    "研究・開発",
    "翻訳・通訳",
  ],
  "医療・福祉": [
    "医療・ヘルスケア",
    "病院・クリニック",
    "介護・福祉",
    "薬局・製薬",
  ],
  "教育・公共": [
    "教育",
    "学校・大学",
    "塾・予備校",
    "官公庁・自治体",
    "NPO・NGO",
    "宗教法人",
  ],
  "農林水産・エネルギー": [
    "農業・林業",
    "水産業",
    "畜産業",
    "エネルギー",
    "鉱業",
    "環境・リサイクル",
  ],
  "その他": [
    "スポーツ",
    "芸能・エンタメ",
    "その他",
  ],
}

// Flatten for filter
const allIndustries = Object.values(industryCategories).flat()

// Global regions and countries - comprehensive list
const locationRegions: Record<string, string[]> = {
  "東アジア": [
    "日本",
    "中国",
    "韓国",
    "台湾",
    "香港",
    "マカオ",
    "モンゴル",
  ],
  "東南アジア": [
    "シンガポール",
    "インドネシア",
    "タイ",
    "ベトナム",
    "フィリピン",
    "マレーシア",
    "ミャンマー",
    "カンボジア",
    "ラオス",
    "ブルネイ",
    "東ティモール",
  ],
  "南アジア": [
    "インド",
    "パキスタン",
    "バングラデシュ",
    "スリランカ",
    "ネパール",
    "ブータン",
    "モルディブ",
    "アフガニスタン",
  ],
  "オセアニア": [
    "オーストラリア",
    "ニュージーランド",
    "パプアニューギニア",
    "フィジー",
    "サモア",
    "トンガ",
    "グアム",
  ],
  "北米": [
    "アメリカ",
    "カナダ",
  ],
  "中米・カリブ": [
    "メキシコ",
    "キューバ",
    "ドミニカ共和国",
    "ジャマイカ",
    "プエルトリコ",
    "パナマ",
    "コスタリカ",
    "グアテマラ",
    "ホンジュラス",
    "エルサルバドル",
    "ニカラグア",
    "ハイチ",
    "バハマ",
  ],
  "南米": [
    "ブラジル",
    "アルゼンチン",
    "チリ",
    "コロンビア",
    "ペルー",
    "ベネズエラ",
    "エクアドル",
    "ボリビア",
    "パラグアイ",
    "ウルグアイ",
    "ガイアナ",
    "スリナム",
  ],
  "西ヨーロッパ": [
    "イギリス",
    "ドイツ",
    "フランス",
    "オランダ",
    "ベルギー",
    "スイス",
    "オーストリア",
    "ルクセンブルク",
    "アイルランド",
    "モナコ",
  ],
  "南ヨーロッパ": [
    "スペイン",
    "イタリア",
    "ポルトガル",
    "ギリシャ",
    "マルタ",
    "キプロス",
    "アンドラ",
    "サンマリノ",
    "バチカン",
  ],
  "北ヨーロッパ": [
    "スウェーデン",
    "ノルウェー",
    "デンマーク",
    "フィンランド",
    "アイスランド",
    "エストニア",
    "ラトビア",
    "リトアニア",
  ],
  "東ヨーロッパ": [
    "ロシア",
    "ウクライナ",
    "ポーランド",
    "チェコ",
    "ハンガリー",
    "ルーマニア",
    "ブルガリア",
    "スロバキア",
    "クロアチア",
    "セルビア",
    "スロベニア",
    "ベラルーシ",
    "モルドバ",
    "ボスニア・ヘルツェゴビナ",
    "北マケドニア",
    "モンテネグロ",
    "アルバニア",
    "コソボ",
  ],
  "中東": [
    "UAE",
    "サウジアラビア",
    "イスラエル",
    "トルコ",
    "イラン",
    "イラク",
    "カタール",
    "クウェート",
    "バーレーン",
    "オマーン",
    "ヨルダン",
    "レバノン",
    "シリア",
    "イエメン",
    "パレスチナ",
  ],
  "中央アジア": [
    "カザフスタン",
    "ウズベキスタン",
    "トルクメニスタン",
    "キルギス",
    "タジキスタン",
    "アゼルバイジャン",
    "ジョージア",
    "アルメニア",
  ],
  "北アフリカ": [
    "エジプト",
    "モロッコ",
    "アルジェリア",
    "チュニジア",
    "リビア",
    "スーダン",
  ],
  "西アフリカ": [
    "ナイジェリア",
    "ガーナ",
    "セネガル",
    "コートジボワール",
    "カメルーン",
    "マリ",
    "ブルキナファソ",
    "ニジェール",
    "ギニア",
    "ベナン",
    "トーゴ",
    "シエラレオネ",
    "リベリア",
    "ガンビア",
  ],
  "東アフリカ": [
    "ケニア",
    "エチオピア",
    "タンザニア",
    "ウガンダ",
    "ルワンダ",
    "ソマリア",
    "エリトリア",
    "ジブチ",
    "マダガスカル",
    "モーリシャス",
  ],
  "南部アフリカ": [
    "南アフリカ",
    "ジンバブエ",
    "ザンビア",
    "ボツワナ",
    "ナミビア",
    "モザンビーク",
    "アンゴラ",
    "マラウイ",
    "レソト",
    "エスワティニ",
  ],
  "中部アフリカ": [
    "コンゴ民主共和国",
    "コンゴ共和国",
    "中央アフリカ",
    "チャド",
    "ガボン",
    "赤道ギニア",
    "ブルンジ",
  ],
}

// Flatten for simple list
const allLocations = Object.values(locationRegions).flat()

const industries = allIndustries; // Declare the industries variable

type SortOption = "name" | "memberCount" | "publicMemberCount" | "foundedAt"
type ViewMode = "list" | "category"

export function EpochOrgDirectory() {
  const [searchQuery, setSearchQuery] = useState("")
  const [filterIndustry, setFilterIndustry] = useState<string | null>(null)
  const [filterLocation, setFilterLocation] = useState<string | null>(null)
  const [minMembers, setMinMembers] = useState(0)
  const [sortBy, setSortBy] = useState<SortOption>("publicMemberCount")
  const [sortDesc, setSortDesc] = useState(true)
  const [showFilters, setShowFilters] = useState(false)
  const [viewMode, setViewMode] = useState<ViewMode>("category")

  const locations = allLocations; // Declare the locations variable

  const filteredOrgs = useMemo(() => {
    let result = mockOrganizations.filter((org) => {
      if (searchQuery) {
        const query = searchQuery.toLowerCase()
        if (
          !org.name.toLowerCase().includes(query) &&
          !org.description?.toLowerCase().includes(query)
        ) {
          return false
        }
      }
      if (filterIndustry && org.industry !== filterIndustry) return false
      if (filterLocation && org.location !== filterLocation) return false
      if (org.publicMemberCount < minMembers) return false
      return true
    })

    result.sort((a, b) => {
      let comparison = 0
      switch (sortBy) {
        case "name":
          comparison = a.name.localeCompare(b.name)
          break
        case "memberCount":
          comparison = a.memberCount - b.memberCount
          break
        case "publicMemberCount":
          comparison = a.publicMemberCount - b.publicMemberCount
          break
        case "foundedAt":
          comparison = new Date(a.foundedAt).getTime() - new Date(b.foundedAt).getTime()
          break
      }
      return sortDesc ? -comparison : comparison
    })

    return result
  }, [searchQuery, filterIndustry, filterLocation, minMembers, sortBy, sortDesc])

  // Group organizations by industry for category view
  const groupedOrgs = useMemo(() => {
    const groups: Record<string, PublicOrganization[]> = {}
    for (const org of filteredOrgs) {
      if (!groups[org.industry]) {
        groups[org.industry] = []
      }
      groups[org.industry].push(org)
    }
    // Sort industries by number of organizations
    return Object.entries(groups).sort((a, b) => b[1].length - a[1].length)
  }, [filteredOrgs])

  const clearFilters = () => {
    setSearchQuery("")
    setFilterIndustry(null)
    setFilterLocation(null)
    setMinMembers(0)
  }

  const hasActiveFilters = searchQuery || filterIndustry || filterLocation || minMembers > 0

  return (
    <div className="min-h-screen bg-background">
      <EpochHeader />

      <main className="container max-w-5xl mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
            <Link href="/browse" className="hover:text-foreground transition-colors">
              ユーザー一覧
            </Link>
            <ChevronRight className="h-4 w-4" />
            <span className="text-foreground">組織一覧</span>
          </div>
          <h1 className="text-2xl font-medium text-foreground">組織ディレクトリ</h1>
          <p className="text-sm text-muted-foreground mt-1">
            公開されている組織とそのメンバーのEpochを探索
          </p>
        </div>

        {/* Tab navigation */}
        <div className="flex gap-4 mb-6 border-b border-border">
          <Link
            href="/browse"
            className="pb-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            ユーザー
          </Link>
          <span className="pb-2 text-sm text-foreground border-b-2 border-foreground">
            組織
          </span>
        </div>

        {/* Search and Filters */}
        <div className="space-y-4 mb-6">
          <div className="flex gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="組織名・説明で検索..."
                className="pl-10 bg-secondary border-border text-foreground"
              />
            </div>
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className={`border-border bg-transparent ${showFilters ? "text-foreground" : "text-muted-foreground"}`}
            >
              <Filter className="h-4 w-4 mr-2" />
              フィルター
              {hasActiveFilters && (
                <span className="ml-2 h-2 w-2 rounded-full bg-foreground" />
              )}
            </Button>
          </div>

          {showFilters && (
            <Card className="bg-card border-border">
              <CardContent className="p-4 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs text-muted-foreground">業種</label>
                    <Select
                      value={filterIndustry || "all"}
                      onValueChange={(v) => setFilterIndustry(v === "all" ? null : v)}
                    >
                      <SelectTrigger className="bg-secondary border-border text-foreground">
                        <SelectValue placeholder="すべて" />
                      </SelectTrigger>
                      <SelectContent className="bg-card border-border max-h-64">
                        <SelectItem value="all" className="text-foreground">
                          すべての業種
                        </SelectItem>
                        {Object.entries(industryCategories).map(([category, industries]) => (
                          <div key={category}>
                            <div className="px-2 py-1.5 text-xs font-medium text-muted-foreground bg-muted/50">
                              {category}
                            </div>
                            {industries.map((ind) => (
                              <SelectItem key={ind} value={ind} className="text-foreground pl-4">
                                {ind}
                              </SelectItem>
                            ))}
                          </div>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs text-muted-foreground">所在地</label>
                    <Select
                      value={filterLocation || "all"}
                      onValueChange={(v) => setFilterLocation(v === "all" ? null : v)}
                    >
                      <SelectTrigger className="bg-secondary border-border text-foreground">
                        <SelectValue placeholder="すべて" />
                      </SelectTrigger>
                      <SelectContent className="bg-card border-border max-h-64">
                        <SelectItem value="all" className="text-foreground">
                          すべての国・地域
                        </SelectItem>
                        {Object.entries(locationRegions).map(([region, countries]) => (
                          <div key={region}>
                            <div className="px-2 py-1.5 text-xs font-medium text-muted-foreground bg-muted/50">
                              {region}
                            </div>
                            {countries.map((country) => (
                              <SelectItem key={country} value={country} className="text-foreground pl-4">
                                {country}
                              </SelectItem>
                            ))}
                          </div>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs text-muted-foreground">並び替え</label>
                    <Select
                      value={`${sortBy}-${sortDesc ? "desc" : "asc"}`}
                      onValueChange={(v) => {
                        const [field, order] = v.split("-")
                        setSortBy(field as SortOption)
                        setSortDesc(order === "desc")
                      }}
                    >
                      <SelectTrigger className="bg-secondary border-border text-foreground">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-card border-border">
                        <SelectItem value="publicMemberCount-desc" className="text-foreground">
                          公開メンバー数（多い順）
                        </SelectItem>
                        <SelectItem value="publicMemberCount-asc" className="text-foreground">
                          公開メンバー数（少ない順）
                        </SelectItem>
                        <SelectItem value="memberCount-desc" className="text-foreground">
                          総メンバー数（多い順）
                        </SelectItem>
                        <SelectItem value="name-asc" className="text-foreground">
                          名前（A-Z）
                        </SelectItem>
                        <SelectItem value="foundedAt-desc" className="text-foreground">
                          設立日（新しい順）
                        </SelectItem>
                        <SelectItem value="foundedAt-asc" className="text-foreground">
                          設立日（古い順）
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs text-muted-foreground">
                    最小公開メンバー数: {minMembers}人以上
                  </label>
                  <Slider
                    value={[minMembers]}
                    onValueChange={([v]) => setMinMembers(v)}
                    max={100}
                    step={5}
                    className="w-full"
                  />
                </div>

                {hasActiveFilters && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearFilters}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    <X className="h-4 w-4 mr-1" />
                    フィルターをクリア
                  </Button>
                )}
              </CardContent>
            </Card>
          )}
        </div>

        {/* Results count and view toggle */}
        <div className="flex items-center justify-between mb-4">
          <div className="text-xs text-muted-foreground">
            {filteredOrgs.length} 件の組織
            {hasActiveFilters && ` / ${mockOrganizations.length} 件中`}
          </div>
          <div className="flex items-center gap-1 border border-border rounded-md p-0.5">
            <button
              onClick={() => setViewMode("category")}
              className={`p-1.5 rounded transition-colors ${
                viewMode === "category"
                  ? "bg-secondary text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
              title="業種別表示"
            >
              <LayoutGrid className="h-4 w-4" />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`p-1.5 rounded transition-colors ${
                viewMode === "list"
                  ? "bg-secondary text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
              title="リスト表示"
            >
              <List className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Organization List or Category View */}
        {viewMode === "category" ? (
          <div className="space-y-8">
            {groupedOrgs.map(([industry, orgs]) => (
              <div key={industry}>
                <div className="flex items-center gap-2 mb-3 pb-2 border-b border-border">
                  <h3 className="text-sm font-medium text-foreground">{industry}</h3>
                  <Badge variant="outline" className="border-border text-muted-foreground text-xs">
                    {orgs.length}
                  </Badge>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {orgs.map((org) => (
                    <Link key={org.id} href={`/org/${org.id}/public`}>
                      <Card className="bg-card border-border hover:border-muted-foreground/50 transition-colors cursor-pointer h-full">
                        <CardContent className="p-3">
                          <div className="flex items-start justify-between">
                            <div className="flex-1 min-w-0">
                              <h4 className="text-sm text-foreground font-medium truncate mb-1">
                                {org.name}
                              </h4>
                              <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                                <span className="flex items-center gap-1">
                                  <MapPin className="h-3 w-3" />
                                  {org.location}
                                </span>
                                <span className="flex items-center gap-1">
                                  <Users className="h-3 w-3" />
                                  {org.publicMemberCount}人
                                </span>
                              </div>
                            </div>
                            <ChevronRight className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
                </div>
              </div>
            ))}

            {groupedOrgs.length === 0 && (
              <div className="py-12 text-center">
                <Building2 className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
                <p className="text-sm text-muted-foreground">該当する組織が見つかりません</p>
                <p className="text-xs text-muted-foreground mt-1">
                  検索条件を変更してください
                </p>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            {filteredOrgs.map((org) => (
              <Link key={org.id} href={`/org/${org.id}/public`}>
                <Card className="bg-card border-border hover:border-muted-foreground/50 transition-colors cursor-pointer">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <Building2 className="h-4 w-4 text-muted-foreground" />
                          <h3 className="text-foreground font-medium truncate">
                            {org.name}
                          </h3>
                        </div>

                        {org.description && (
                          <p className="text-sm text-muted-foreground mb-2 line-clamp-1">
                            {org.description}
                          </p>
                        )}

                        <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
                          <Badge variant="outline" className="border-border text-muted-foreground">
                            {org.industry}
                          </Badge>
                          <span className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {org.location}
                          </span>
                          <span className="flex items-center gap-1">
                            <Users className="h-3 w-3" />
                            {org.publicMemberCount} 人公開 / {org.memberCount} 人
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {new Date(org.foundedAt).getFullYear()}年設立
                          </span>
                        </div>
                      </div>

                      <ChevronRight className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}

            {filteredOrgs.length === 0 && (
              <div className="py-12 text-center">
                <Building2 className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
                <p className="text-sm text-muted-foreground">該当する組織が見つかりません</p>
                <p className="text-xs text-muted-foreground mt-1">
                  検索条件を変更してください
                </p>
              </div>
            )}
          </div>
        )}

        {/* Note */}
        <div className="mt-8 p-4 border border-border rounded-md bg-muted/20">
          <p className="text-xs text-muted-foreground">
            組織の公開メンバーのEpochを閲覧するには、通常の閲覧と同様に課金が必要です。
            組織単位でのまとめ表示やランキングは行いません。
          </p>
        </div>
      </main>

      <EpochFooter />
    </div>
  )
}
