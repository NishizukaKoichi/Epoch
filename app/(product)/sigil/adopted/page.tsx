"use client"

import { useState } from "react"
import Link from "next/link"
import { Download, FolderOpen, Eye, Edit, Trash2, MoreVertical, ExternalLink, RefreshCw } from "@/components/icons"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useI18n } from "@/lib/i18n/context"

const mockAdoptedSpaces = [
  {
    id: "adopted-1",
    name: "Engineering Onboarding",
    originalAuthor: "TechCorp Inc.",
    originalId: "techcorp-eng",
    purpose: "新規エンジニアが最初の30日で理解すべき術式",
    adoptedAt: "2026-01-15",
    lastSynced: "2026-01-20",
    hasUpdates: true,
    chapters: 6,
  },
  {
    id: "adopted-2",
    name: "Design System Guidelines",
    originalAuthor: "DesignStudio",
    originalId: "designstudio-ds",
    purpose: "デザインシステムの運用ルール",
    adoptedAt: "2026-01-10",
    lastSynced: "2026-01-10",
    hasUpdates: false,
    chapters: 4,
  },
  {
    id: "adopted-3",
    name: "Remote Work Protocol",
    originalAuthor: "RemoteFirst Co.",
    originalId: "remotefirst-protocol",
    purpose: "リモートワークにおける判断基準",
    adoptedAt: "2026-01-05",
    lastSynced: "2026-01-18",
    hasUpdates: false,
    chapters: 5,
  },
]

export default function SigilAdoptedPage() {
  const { t } = useI18n()
  const [deleteDialog, setDeleteDialog] = useState<string | null>(null)
  const [syncDialog, setSyncDialog] = useState<string | null>(null)

  const handleDelete = (id: string) => {
    // Delete logic
    setDeleteDialog(null)
  }

  const handleSync = (id: string) => {
    // Sync logic
    setSyncDialog(null)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">採用した術式</h1>
          <p className="text-sm text-muted-foreground mt-1">
            他の組織から採用した術式を管理
          </p>
        </div>
        <Link href="/sigil/explore">
          <Button variant="outline" className="gap-2 bg-transparent">
            <Download className="h-4 w-4" />
            術式を探す
          </Button>
        </Link>
      </div>

      {/* Adopted spaces list */}
      {mockAdoptedSpaces.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Download className="h-12 w-12 text-muted-foreground/50 mb-4" />
            <p className="text-muted-foreground">採用した術式はありません</p>
            <Link href="/sigil/explore" className="mt-4">
              <Button variant="outline" className="bg-transparent">
                公開術式を探索する
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {mockAdoptedSpaces.map((space) => (
            <Card key={space.id} className="hover:border-muted-foreground/30 transition-colors">
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <Link 
                        href={`/sigil/spaces/${space.id}/edit`}
                        className="font-medium text-foreground hover:underline"
                      >
                        {space.name}
                      </Link>
                      {space.hasUpdates && (
                        <Badge variant="secondary" className="text-xs bg-amber-500/10 text-amber-500">
                          更新あり
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground truncate">
                      {space.purpose}
                    </p>
                    <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <ExternalLink className="h-3 w-3" />
                        {space.originalAuthor}
                      </span>
                      <span>{space.chapters}章</span>
                      <span>採用: {space.adoptedAt}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {space.hasUpdates && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="gap-1 bg-transparent"
                        onClick={() => setSyncDialog(space.id)}
                      >
                        <RefreshCw className="h-3.5 w-3.5" />
                        同期
                      </Button>
                    )}
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild>
                          <Link href={`/sigil/space/${space.id}`} className="flex items-center gap-2">
                            <Eye className="h-4 w-4" />
                            プレビュー
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link href={`/sigil/spaces/${space.id}/edit`} className="flex items-center gap-2">
                            <Edit className="h-4 w-4" />
                            編集
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link href={`/sigil/explore/${space.originalId}`} className="flex items-center gap-2">
                            <ExternalLink className="h-4 w-4" />
                            元の術式を見る
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem 
                          className="text-destructive"
                          onClick={() => setDeleteDialog(space.id)}
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          採用を解除
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Sync Dialog */}
      <Dialog open={!!syncDialog} onOpenChange={() => setSyncDialog(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>術式を同期</DialogTitle>
            <DialogDescription>
              元の術式に更新があります。同期すると、あなたのカスタマイズ内容は上書きされる可能性があります。
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <p className="text-sm text-muted-foreground">
              同期オプション:
            </p>
            <ul className="mt-2 space-y-2 text-sm">
              <li className="flex items-center gap-2">
                <input type="radio" name="sync" id="sync-full" defaultChecked />
                <label htmlFor="sync-full">完全同期（カスタマイズを破棄）</label>
              </li>
              <li className="flex items-center gap-2">
                <input type="radio" name="sync" id="sync-merge" />
                <label htmlFor="sync-merge">差分を確認して手動マージ</label>
              </li>
            </ul>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setSyncDialog(null)} className="bg-transparent">
              キャンセル
            </Button>
            <Button onClick={() => handleSync(syncDialog!)}>
              同期する
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={!!deleteDialog} onOpenChange={() => setDeleteDialog(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>採用を解除</DialogTitle>
            <DialogDescription>
              この術式の採用を解除しますか？スペースとその内容は完全に削除されます。
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialog(null)} className="bg-transparent">
              キャンセル
            </Button>
            <Button variant="destructive" onClick={() => handleDelete(deleteDialog!)}>
              解除する
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
