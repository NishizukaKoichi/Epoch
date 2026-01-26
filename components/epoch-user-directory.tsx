"use client"

import { useState, useMemo } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, User, ChevronLeft, ChevronRight, Filter, Grid, List } from "@/components/icons"
import { Slider } from "@/components/ui/slider"
import Link from "next/link"
import { useI18n } from "@/lib/i18n/context"

interface PublicUser {
  userId: string
  displayName: string
  bio: string
  profession: string
  region: string
  recordCount: number
  firstRecordAt: string
  scoutVisible: boolean
}

const mockUsers: PublicUser[] = [
  {
    userId: "user_001",
    displayName: "Taro Yamada",
    bio: "Software engineer. Recording decisions.",
    profession: "tech",
    region: "asia",
    recordCount: 234,
    firstRecordAt: "2024-01-15",
    scoutVisible: true,
  },
  {
    userId: "user_002",
    displayName: "Hanako Sato",
    bio: "Product manager. Transparency in decisions.",
    profession: "tech",
    region: "asia",
    recordCount: 189,
    firstRecordAt: "2024-02-20",
    scoutVisible: true,
  },
  {
    userId: "user_003",
    displayName: "John Smith",
    bio: "Designer. Recording creative decisions.",
    profession: "creative",
    region: "north_america",
    recordCount: 67,
    firstRecordAt: "2024-03-10",
    scoutVisible: false,
  },
  {
    userId: "user_004",
    displayName: "Maria Garcia",
    bio: "CEO. Business decision history.",
    profession: "consulting",
    region: "europe",
    recordCount: 412,
    firstRecordAt: "2023-11-05",
    scoutVisible: true,
  },
  {
    userId: "user_005",
    displayName: "Li Wei",
    bio: "Researcher. Academic decisions.",
    profession: "education",
    region: "asia",
    recordCount: 156,
    firstRecordAt: "2024-01-22",
    scoutVisible: true,
  },
  {
    userId: "user_006",
    displayName: "Emma Johnson",
    bio: "Lawyer. Legal decision transparency.",
    profession: "consulting",
    region: "north_america",
    recordCount: 298,
    firstRecordAt: "2023-12-01",
    scoutVisible: true,
  },
  {
    userId: "user_007",
    displayName: "Ahmed Hassan",
    bio: "Doctor. Clinical decisions.",
    profession: "healthcare",
    region: "africa",
    recordCount: 521,
    firstRecordAt: "2023-10-15",
    scoutVisible: false,
  },
  {
    userId: "user_008",
    displayName: "Sophie Martin",
    bio: "Investor. Investment decisions.",
    profession: "finance",
    region: "europe",
    recordCount: 345,
    firstRecordAt: "2024-02-08",
    scoutVisible: true,
  },
]

const ITEMS_PER_PAGE = 12

export function EpochUserDirectory() {
  const { t } = useI18n()

  const professions = [
    { value: "all", label: t("directory.industry") },
    { value: "tech", label: t("industry.tech") },
    { value: "finance", label: t("industry.finance") },
    { value: "healthcare", label: t("industry.healthcare") },
    { value: "education", label: t("industry.education") },
    { value: "creative", label: t("industry.creative") },
    { value: "consulting", label: t("industry.consulting") },
  ]

  const regions = [
    { value: "all", label: t("directory.region") },
    { value: "asia", label: t("region.asia") },
    { value: "europe", label: t("region.europe") },
    { value: "north_america", label: t("region.north_america") },
    { value: "south_america", label: t("region.south_america") },
    { value: "africa", label: t("region.africa") },
    { value: "oceania", label: t("region.oceania") },
  ]

  const sortOptions = [
    { value: "newest", label: t("directory.sort.newest") },
    { value: "oldest", label: t("directory.sort.oldest") },
    { value: "name_asc", label: t("directory.sort.name_asc") },
    { value: "name_desc", label: t("directory.sort.name_desc") },
    { value: "records_high", label: t("directory.sort.records_desc") },
    { value: "records_low", label: t("directory.sort.records_asc") },
  ]

  const [searchQuery, setSearchQuery] = useState("")
  const [profession, setProfession] = useState("all")
  const [region, setRegion] = useState("all")
  const [sortBy, setSortBy] = useState("newest")
  const [scoutOnly, setScoutOnly] = useState(false)
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [currentPage, setCurrentPage] = useState(1)
  const [showFilters, setShowFilters] = useState(false)
  const [minRecords, setMinRecords] = useState(0)
  const [maxRecords, setMaxRecords] = useState(1000)

  const maxRecordCount = useMemo(() => {
    return Math.max(...mockUsers.map((u) => u.recordCount), 1000)
  }, [])

  const filteredAndSortedUsers = useMemo(() => {
    let result = [...mockUsers]

    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      result = result.filter(
        (u) =>
          u.displayName.toLowerCase().includes(query) ||
          u.userId.toLowerCase().includes(query) ||
          u.bio.toLowerCase().includes(query),
      )
    }
    if (profession !== "all") {
      result = result.filter((u) => u.profession === profession)
    }
    if (region !== "all") {
      result = result.filter((u) => u.region === region)
    }
    if (scoutOnly) {
      result = result.filter((u) => u.scoutVisible)
    }
    result = result.filter((u) => u.recordCount >= minRecords && u.recordCount <= maxRecords)

    switch (sortBy) {
      case "newest":
        result.sort((a, b) => new Date(b.firstRecordAt).getTime() - new Date(a.firstRecordAt).getTime())
        break
      case "oldest":
        result.sort((a, b) => new Date(a.firstRecordAt).getTime() - new Date(b.firstRecordAt).getTime())
        break
      case "name_asc":
        result.sort((a, b) => a.displayName.localeCompare(b.displayName))
        break
      case "name_desc":
        result.sort((a, b) => b.displayName.localeCompare(a.displayName))
        break
      case "records_high":
        result.sort((a, b) => b.recordCount - a.recordCount)
        break
      case "records_low":
        result.sort((a, b) => a.recordCount - b.recordCount)
        break
    }

    return result
  }, [searchQuery, profession, region, sortBy, scoutOnly, minRecords, maxRecords])

  const totalPages = Math.ceil(filteredAndSortedUsers.length / ITEMS_PER_PAGE)
  const paginatedUsers = filteredAndSortedUsers.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE)

  const activeFilterCount = [
    profession !== "all",
    region !== "all",
    scoutOnly,
    minRecords > 0 || maxRecords < maxRecordCount,
  ].filter(Boolean).length

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-medium text-foreground tracking-tight">{t("directory.title")}</h1>
        <p className="text-sm text-muted-foreground mt-1">{t("directory.desc")}</p>
      </div>

      {/* Tab navigation */}
      <div className="flex gap-4 border-b border-border">
        <span className="pb-2 text-sm text-foreground border-b-2 border-foreground">
          ユーザー
        </span>
        <Link
          href="/browse/orgs"
          className="pb-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          組織
        </Link>
      </div>

      <div className="space-y-4">
        <div className="flex gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value)
                setCurrentPage(1)
              }}
              placeholder={t("directory.search")}
              className="pl-10 bg-background border-border"
            />
          </div>
          <Button variant="outline" onClick={() => setShowFilters(!showFilters)} className="border-border relative">
            <Filter className="h-4 w-4 mr-2" />
            {activeFilterCount > 0 && (
              <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-foreground text-background text-xs flex items-center justify-center">
                {activeFilterCount}
              </span>
            )}
          </Button>
          <div className="flex border border-border rounded-md">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setViewMode("grid")}
              className={viewMode === "grid" ? "bg-muted" : ""}
            >
              <Grid className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setViewMode("list")}
              className={viewMode === "list" ? "bg-muted" : ""}
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {showFilters && (
          <div className="p-4 border border-border rounded-lg bg-muted/20 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Select
                value={profession}
                onValueChange={(v) => {
                  setProfession(v)
                  setCurrentPage(1)
                }}
              >
                <SelectTrigger className="bg-background border-border">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {professions.map((p) => (
                    <SelectItem key={p.value} value={p.value}>
                      {p.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select
                value={region}
                onValueChange={(v) => {
                  setRegion(v)
                  setCurrentPage(1)
                }}
              >
                <SelectTrigger className="bg-background border-border">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {regions.map((r) => (
                    <SelectItem key={r.value} value={r.value}>
                      {r.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="bg-background border-border">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {sortOptions.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-3 pt-2 border-t border-border">
              <div className="flex items-center justify-between">
                <label className="text-xs font-medium text-muted-foreground">{t("directory.records_filter")}</label>
                <span className="text-xs text-muted-foreground font-mono">
                  {minRecords} - {maxRecords === maxRecordCount ? `${maxRecords}+` : maxRecords}
                </span>
              </div>
              <div className="px-2">
                <Slider
                  value={[minRecords, maxRecords]}
                  min={0}
                  max={maxRecordCount}
                  step={10}
                  onValueChange={([min, max]) => {
                    setMinRecords(min)
                    setMaxRecords(max)
                    setCurrentPage(1)
                  }}
                  className="w-full"
                />
              </div>
              <p className="text-[10px] text-muted-foreground">{t("directory.records_note")}</p>
            </div>
          </div>
        )}
      </div>

      <p className="text-sm text-muted-foreground">
        {filteredAndSortedUsers.length} {t("directory.records_count")}
      </p>

      {paginatedUsers.length === 0 ? (
        <div className="text-center py-16 border border-dashed border-border rounded-lg">
          <User className="h-12 w-12 mx-auto text-muted-foreground/50" />
          <p className="mt-4 text-muted-foreground">{t("directory.no_results")}</p>
          <p className="text-sm text-muted-foreground">{t("directory.try_different")}</p>
        </div>
      ) : viewMode === "grid" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {paginatedUsers.map((user) => (
            <div key={user.userId} className="p-4 border border-border rounded-lg bg-card">
              <div className="flex items-start gap-3">
                <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center shrink-0">
                  <User className="h-6 w-6 text-muted-foreground" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-foreground truncate">{user.displayName}</p>
                  <p className="text-xs text-muted-foreground font-mono">{user.userId}</p>
                </div>
              </div>
              <p className="mt-3 text-sm text-muted-foreground line-clamp-2">{user.bio}</p>
              <div className="mt-3 flex items-center gap-4 text-xs text-muted-foreground">
                <span>{user.recordCount} records</span>
              </div>
              <div className="mt-4 flex gap-2">
                <Link href={`/user/${user.userId}`} className="flex-1">
                  <Button variant="outline" size="sm" className="w-full border-border bg-transparent">
                    {t("directory.view_epoch")}
                  </Button>
                </Link>
                {user.scoutVisible && (
                  <Button variant="default" size="sm" className="flex-1 bg-foreground text-background">
                    {t("directory.send_scout")}
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-2">
          {paginatedUsers.map((user) => (
            <Link
              key={user.userId}
              href={`/user/${user.userId}`}
              className="flex items-center gap-4 p-4 border border-border rounded-lg bg-card hover:bg-muted/30 transition-colors"
            >
              <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center shrink-0">
                <User className="h-5 w-5 text-muted-foreground" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-foreground">{user.displayName}</p>
                <p className="text-sm text-muted-foreground truncate">{user.bio}</p>
              </div>
              <span className="text-sm text-muted-foreground">{user.recordCount} records</span>
            </Link>
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-4">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="border-border"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-sm text-muted-foreground px-4">
            {currentPage} / {totalPages}
          </span>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="border-border"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  )
}
