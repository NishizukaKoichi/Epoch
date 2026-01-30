"use client"

import { useState } from "react"
import { 
  Eye, 
  Users, 
  Download,
  CheckCircle2,
  BookOpen,
  Info
} from "@/components/icons"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { useI18n } from "@/lib/i18n/context"

// Analytics data - these are metrics that can be realistically tracked
// via page views, auth sessions, and explicit user actions (button clicks)
const mockStats = {
  totalViews: 1284,           // Page view count (trackable)
  uniqueVisitors: 456,        // Unique authenticated users (trackable via auth)
  chaptersCompleted: 892,     // "読了" button clicks (trackable)
  adoptions: 12,              // Adopt button clicks (trackable)
}

const mockSpaceStats = [
  { 
    name: "Engineering Team", 
    views: 543,                // Page views (trackable)
    chaptersCompleted: 312,    // 読了 clicks (trackable)
    totalChapters: 6,
  },
  { 
    name: "Design Team", 
    views: 321, 
    chaptersCompleted: 198,
    totalChapters: 5,
  },
  { 
    name: "Sales Team", 
    views: 187, 
    chaptersCompleted: 89,
    totalChapters: 4,
  },
]

// Chapter stats - views and completion clicks are trackable
const mockChapterStats = [
  { name: "術式の前提条件", views: 456, completed: 423 },
  { name: "発動条件", views: 423, completed: 367 },
  { name: "日常的に発生する判断", views: 398, completed: 312 },
  { name: "完了条件（Done定義）", views: 367, completed: 267 },
  { name: "権限と責任の境界", views: 312, completed: 198 },
  { name: "例外・逸脱時の扱い", views: 289, completed: 156 },
]

// Reader activity - trackable via auth and explicit actions
const mockRecentReaders = [
  { name: "田中太郎", email: "tanaka@example.com", completedChapters: 6, totalChapters: 6, lastAccess: "2026-01-23T10:30:00" },
  { name: "山田花子", email: "yamada@example.com", completedChapters: 4, totalChapters: 6, lastAccess: "2026-01-23T07:15:00" },
  { name: "佐藤次郎", email: "sato@example.com", completedChapters: 2, totalChapters: 6, lastAccess: "2026-01-22T14:00:00" },
  { name: "鈴木美咲", email: "suzuki@example.com", completedChapters: 6, totalChapters: 6, lastAccess: "2026-01-21T09:45:00" },
]

function formatLastAccess(dateString: string): string {
  const date = new Date(dateString)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
  const diffDays = Math.floor(diffHours / 24)
  
  if (diffHours < 1) return "1時間以内"
  if (diffHours < 24) return `${diffHours}時間前`
  if (diffDays < 7) return `${diffDays}日前`
  return date.toLocaleDateString("ja-JP")
}

export default function SigilAnalyticsPage() {
  const { t } = useI18n()
  const [period, setPeriod] = useState("30d")

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">分析</h1>
          <p className="text-sm text-muted-foreground mt-1">
            術式の閲覧状況と読了率を確認
          </p>
        </div>
        <Select value={period} onValueChange={setPeriod}>
          <SelectTrigger className="w-32">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7d">過去7日</SelectItem>
            <SelectItem value="30d">過去30日</SelectItem>
            <SelectItem value="90d">過去90日</SelectItem>
            <SelectItem value="all">全期間</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Stats Overview */}
      <TooltipProvider>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-md bg-amber-500/10">
                  <Eye className="h-5 w-5 text-amber-500" />
                </div>
                <div>
                  <div className="flex items-center gap-1">
                    <p className="text-2xl font-bold">{mockStats.totalViews.toLocaleString()}</p>
                    <Tooltip>
                      <TooltipTrigger>
                        <Info className="h-3 w-3 text-muted-foreground" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>ページが表示された回数</p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                  <p className="text-xs text-muted-foreground">ページビュー</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-md bg-blue-500/10">
                  <Users className="h-5 w-5 text-blue-500" />
                </div>
                <div>
                  <div className="flex items-center gap-1">
                    <p className="text-2xl font-bold">{mockStats.uniqueVisitors}</p>
                    <Tooltip>
                      <TooltipTrigger>
                        <Info className="h-3 w-3 text-muted-foreground" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>認証済みユーザーの数</p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                  <p className="text-xs text-muted-foreground">ユニーク閲覧者</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-md bg-green-500/10">
                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                </div>
                <div>
                  <div className="flex items-center gap-1">
                    <p className="text-2xl font-bold">{mockStats.chaptersCompleted}</p>
                    <Tooltip>
                      <TooltipTrigger>
                        <Info className="h-3 w-3 text-muted-foreground" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>「読了」ボタンがクリックされた回数</p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                  <p className="text-xs text-muted-foreground">章の読了完了</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-md bg-cyan-500/10">
                  <Download className="h-5 w-5 text-cyan-500" />
                </div>
                <div>
                  <div className="flex items-center gap-1">
                    <p className="text-2xl font-bold">{mockStats.adoptions}</p>
                    <Tooltip>
                      <TooltipTrigger>
                        <Info className="h-3 w-3 text-muted-foreground" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>他の組織が採用した回数</p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                  <p className="text-xs text-muted-foreground">採用数</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </TooltipProvider>

      {/* Space Performance */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">スペース別</CardTitle>
          <CardDescription>各スペースの閲覧数と読了完了数</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockSpaceStats.map((space, index) => (
              <div key={index} className="flex items-center gap-4">
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm truncate">{space.name}</p>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground mt-1">
                    <span className="flex items-center gap-1">
                      <Eye className="h-3 w-3" />
                      {space.views}
                    </span>
                    <span className="flex items-center gap-1">
                      <CheckCircle2 className="h-3 w-3" />
                      {space.chaptersCompleted} / {space.totalChapters * Math.ceil(space.views / 10)} 章完了
                    </span>
                  </div>
                </div>
                <Badge variant="secondary">
                  {space.totalChapters}章
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Chapter Completion */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">章別の読了完了数</CardTitle>
          <CardDescription>各章で「読了」ボタンがクリックされた回数</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {mockChapterStats.map((chapter, index) => (
              <div key={index} className="space-y-1">
                <div className="flex items-center justify-between text-sm">
                  <span className="truncate">{chapter.name}</span>
                  <span className="text-muted-foreground ml-2">
                    {chapter.completed} / {chapter.views} 
                    <span className="text-xs ml-1">({Math.round(chapter.completed / chapter.views * 100)}%)</span>
                  </span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-amber-500 rounded-full transition-all"
                    style={{ width: `${Math.round(chapter.completed / chapter.views * 100)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
          <p className="text-xs text-muted-foreground mt-4">
            ※ 閲覧数に対する読了完了数の割合を表示しています
          </p>
        </CardContent>
      </Card>

      {/* Recent Readers */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">最近の読者</CardTitle>
          <CardDescription>直近でアクセスした認証済みユーザー</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {mockRecentReaders.map((reader, index) => (
              <div key={index} className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center text-sm font-medium">
                  {reader.name[0]}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{reader.name}</p>
                  <p className="text-xs text-muted-foreground truncate">{reader.email}</p>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-1">
                    {reader.completedChapters === reader.totalChapters ? (
                      <Badge variant="secondary" className="text-green-500">
                        <CheckCircle2 className="h-3 w-3 mr-1" />
                        全章読了
                      </Badge>
                    ) : (
                      <Badge variant="secondary">
                        <BookOpen className="h-3 w-3 mr-1" />
                        {reader.completedChapters}/{reader.totalChapters}章
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">{formatLastAccess(reader.lastAccess)}</p>
                </div>
              </div>
            ))}
          </div>
          <p className="text-xs text-muted-foreground mt-4">
            ※ 認証済みユーザーのみ表示されます
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
