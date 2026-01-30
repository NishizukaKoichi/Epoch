"use client"

import { useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { ChevronLeft, Save, Eye, Trash2, GripVertical, Plus, X } from "@/components/icons"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useI18n } from "@/lib/i18n/context"

// Mock chapter data
const mockChapterData: Record<string, {
  title: string
  summary: string
  scope: string
  content: string
  items: { id: string; text: string }[]
}> = {
  "1": {
    title: "術式の前提条件",
    summary: "この術式が適用される範囲と条件",
    scope: "エンジニアリングチームに所属する全メンバー",
    content: "この術式は以下の前提のもとで適用されます。前提条件を満たさない場合、術式は発動しません。",
    items: [
      { id: "1", text: "正社員・契約社員・業務委託を問わず、エンジニアリングチームに所属していること" },
      { id: "2", text: "オンボーディング期間（入社後30日間）であること" },
      { id: "3", text: "開発環境のセットアップが完了していること" },
    ],
  },
  "2": {
    title: "発動条件",
    summary: "術式が発動するトリガーとなる状況",
    scope: "日常の開発業務において",
    content: "以下の状況において、この術式に基づいた判断が求められます。",
    items: [
      { id: "1", text: "コードレビューを依頼する/受ける場面" },
      { id: "2", text: "技術的な意思決定を行う場面" },
      { id: "3", text: "ドキュメントを作成・更新する場面" },
    ],
  },
  "3": {
    title: "日常的に発生する判断",
    summary: "日々の業務で遭遇する判断基準",
    scope: "コードレビュー、設計判断、コミュニケーション",
    content: "以下の判断基準に従って日常の業務を遂行します。",
    items: [
      { id: "1", text: "レビューは24時間以内に初回コメントを返す" },
      { id: "2", text: "Approveは最低2名から取得する" },
      { id: "3", text: "技術的負債を残す場合はIssueを作成する" },
    ],
  },
}

export default function SigilChapterEditPage() {
  const { t } = useI18n()
  const router = useRouter()
  const params = useParams()
  const spaceId = params.spaceId as string
  const chapterId = params.chapterId as string

  const initialData = mockChapterData[chapterId] || mockChapterData["1"]

  const [title, setTitle] = useState(initialData.title)
  const [summary, setSummary] = useState(initialData.summary)
  const [scope, setScope] = useState(initialData.scope)
  const [content, setContent] = useState(initialData.content)
  const [items, setItems] = useState(initialData.items)
  const [newItem, setNewItem] = useState("")
  const [saved, setSaved] = useState(false)
  const [deleteDialog, setDeleteDialog] = useState(false)

  const handleSave = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const addItem = () => {
    if (newItem.trim()) {
      setItems([...items, { id: Date.now().toString(), text: newItem.trim() }])
      setNewItem("")
    }
  }

  const removeItem = (id: string) => {
    setItems(items.filter(item => item.id !== id))
  }

  const updateItem = (id: string, text: string) => {
    setItems(items.map(item => item.id === id ? { ...item, text } : item))
  }

  const handleDelete = () => {
    router.push(`/sigil/spaces/${spaceId}/edit`)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.back()}
            className="h-8 w-8"
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-xl font-semibold text-foreground">章を編集</h1>
            <p className="text-sm text-muted-foreground">
              第{chapterId}章
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            className="gap-2 bg-transparent"
            onClick={() => router.push(`/sigil/space/${spaceId}/chapter/${chapterId}`)}
          >
            <Eye className="h-4 w-4" />
            プレビュー
          </Button>
          <Button onClick={handleSave} className="gap-2">
            <Save className="h-4 w-4" />
            {saved ? "保存しました" : "保存"}
          </Button>
        </div>
      </div>

      {/* Basic Info */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">基本情報</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">章タイトル</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="術式の前提条件"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="summary">概要</Label>
            <Input
              id="summary"
              value={summary}
              onChange={(e) => setSummary(e.target.value)}
              placeholder="この章の簡潔な説明"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="scope">適用範囲</Label>
            <Input
              id="scope"
              value={scope}
              onChange={(e) => setScope(e.target.value)}
              placeholder="この章が適用される範囲"
            />
          </div>
        </CardContent>
      </Card>

      {/* Content */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">本文</CardTitle>
          <CardDescription>章の導入文や説明</CardDescription>
        </CardHeader>
        <CardContent>
          <Textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="この章の内容を記述..."
            rows={4}
          />
        </CardContent>
      </Card>

      {/* Items */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">項目一覧</CardTitle>
          <CardDescription>術式の具体的な項目（ドラッグで並び替え可能）</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {items.map((item, index) => (
            <div 
              key={item.id}
              className="flex items-start gap-2 group"
            >
              <button className="mt-2.5 cursor-grab text-muted-foreground/50 hover:text-muted-foreground">
                <GripVertical className="h-4 w-4" />
              </button>
              <span className="mt-2 text-sm text-muted-foreground w-6">{index + 1}.</span>
              <Textarea
                value={item.text}
                onChange={(e) => updateItem(item.id, e.target.value)}
                rows={2}
                className="flex-1"
              />
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => removeItem(item.id)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}

          <div className="flex items-start gap-2 pt-2 border-t border-border">
            <span className="mt-2 text-sm text-muted-foreground w-10 pl-6">{items.length + 1}.</span>
            <Input
              value={newItem}
              onChange={(e) => setNewItem(e.target.value)}
              placeholder="新しい項目を追加..."
              onKeyDown={(e) => e.key === "Enter" && addItem()}
              className="flex-1"
            />
            <Button
              variant="outline"
              size="icon"
              onClick={addItem}
              disabled={!newItem.trim()}
              className="bg-transparent"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Danger Zone */}
      <Card className="border-destructive/50">
        <CardHeader>
          <CardTitle className="text-base text-destructive">危険な操作</CardTitle>
        </CardHeader>
        <CardContent>
          <Button
            variant="destructive"
            className="gap-2"
            onClick={() => setDeleteDialog(true)}
          >
            <Trash2 className="h-4 w-4" />
            この章を削除
          </Button>
        </CardContent>
      </Card>

      {/* Delete Dialog */}
      <Dialog open={deleteDialog} onOpenChange={setDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>章を削除</DialogTitle>
            <DialogDescription>
              「{title}」を削除しますか？この操作は取り消せません。
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialog(false)} className="bg-transparent">
              キャンセル
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              削除する
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
