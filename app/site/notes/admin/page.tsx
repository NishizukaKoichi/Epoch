"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ChevronLeft, Plus, Edit2, Trash2, Save, X } from "@/components/icons"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { useI18n } from "@/lib/i18n/context"
import { useAuth } from "@/lib/auth/context"

// Sample notes data (in real app, this would be from database)
const initialNotes = [
  {
    id: "note-1",
    title: "なぜ「履歴を削除できない」を原則にしたか",
    content: "Epochの設計思想について...",
    date: "2025-01-15",
    tags: ["Epoch", "設計思想"],
  },
  {
    id: "note-2",
    title: "Sigilの設計意図について",
    content: "Sigilは術式の事前開示を目的として...",
    date: "2025-01-10",
    tags: ["Sigil", "設計思想"],
  },
  {
    id: "note-3",
    title: "プロダクト間の境界線",
    content: "各プロダクトの責務を明確に...",
    date: "2025-01-05",
    tags: ["全体設計"],
  },
]

interface Note {
  id: string
  title: string
  content: string
  date: string
  tags: string[]
}

export default function NotesAdminPage() {
  const { t } = useI18n()
  const router = useRouter()
  const { isAdmin, isLoggedIn } = useAuth() // Declare isLoggedIn here
  
  const [notes, setNotes] = useState<Note[]>(initialNotes)
  const [editingNote, setEditingNote] = useState<Note | null>(null)
  const [isNewNote, setIsNewNote] = useState(false)
  const [deleteNoteId, setDeleteNoteId] = useState<string | null>(null)
  
  // Form state
  const [formTitle, setFormTitle] = useState("")
  const [formContent, setFormContent] = useState("")
  const [formTags, setFormTags] = useState("")

  // 管理者チェック
  if (!isAdmin) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-16 text-center">
        <p className="text-muted-foreground">この機能は開発者のみアクセスできます</p>
        <Link href="/site/notes">
          <Button variant="outline" className="mt-4 bg-transparent">戻る</Button>
        </Link>
      </div>
    )
  }

  const handleNewNote = () => {
    setIsNewNote(true)
    setEditingNote(null)
    setFormTitle("")
    setFormContent("")
    setFormTags("")
  }

  const handleEditNote = (note: Note) => {
    setIsNewNote(false)
    setEditingNote(note)
    setFormTitle(note.title)
    setFormContent(note.content)
    setFormTags(note.tags.join(", "))
  }

  const handleSaveNote = () => {
    const tagsArray = formTags.split(",").map(t => t.trim()).filter(Boolean)
    
    if (isNewNote) {
      const newNote: Note = {
        id: `note-${Date.now()}`,
        title: formTitle,
        content: formContent,
        date: new Date().toISOString().split("T")[0],
        tags: tagsArray,
      }
      setNotes([newNote, ...notes])
    } else if (editingNote) {
      setNotes(notes.map(n => 
        n.id === editingNote.id 
          ? { ...n, title: formTitle, content: formContent, tags: tagsArray }
          : n
      ))
    }
    
    setEditingNote(null)
    setIsNewNote(false)
  }

  const handleDeleteNote = () => {
    if (deleteNoteId) {
      setNotes(notes.filter(n => n.id !== deleteNoteId))
      setDeleteNoteId(null)
    }
  }

  const handleCancel = () => {
    setEditingNote(null)
    setIsNewNote(false)
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.back()}
            className="h-8 w-8"
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-xl font-semibold text-foreground">Notes 管理</h1>
            <p className="text-sm text-muted-foreground">記事の追加・編集・削除</p>
          </div>
        </div>
        <Button onClick={handleNewNote} className="gap-2">
          <Plus className="h-4 w-4" />
          新規作成
        </Button>
      </div>

      {/* Notes List */}
      <div className="space-y-3">
        {notes.map((note) => (
          <Card key={note.id}>
            <CardContent className="py-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-foreground truncate">{note.title}</h3>
                  <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{note.content}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <time className="text-xs text-muted-foreground">{note.date}</time>
                    {note.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-[10px] text-muted-foreground bg-muted px-1.5 py-0.5 rounded"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => handleEditNote(note)}
                  >
                    <Edit2 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-destructive hover:text-destructive"
                    onClick={() => setDeleteNoteId(note.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Edit/New Dialog */}
      <Dialog open={!!editingNote || isNewNote} onOpenChange={() => handleCancel()}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{isNewNote ? "新規ノート作成" : "ノートを編集"}</DialogTitle>
            <DialogDescription>
              {isNewNote ? "新しいノートを作成します" : "ノートの内容を編集します"}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="title">タイトル</Label>
              <Input
                id="title"
                value={formTitle}
                onChange={(e) => setFormTitle(e.target.value)}
                placeholder="ノートのタイトル"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="content">本文</Label>
              <Textarea
                id="content"
                value={formContent}
                onChange={(e) => setFormContent(e.target.value)}
                placeholder="ノートの本文（Markdown対応）"
                rows={10}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="tags">タグ（カンマ区切り）</Label>
              <Input
                id="tags"
                value={formTags}
                onChange={(e) => setFormTags(e.target.value)}
                placeholder="Epoch, 設計思想"
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={handleCancel} className="bg-transparent">
              キャンセル
            </Button>
            <Button onClick={handleSaveNote} disabled={!formTitle} className="gap-2">
              <Save className="h-4 w-4" />
              保存
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteNoteId} onOpenChange={() => setDeleteNoteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>ノートを削除しますか？</AlertDialogTitle>
            <AlertDialogDescription>
              この操作は取り消せません。本当に削除しますか？
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>キャンセル</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteNote}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              削除
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
