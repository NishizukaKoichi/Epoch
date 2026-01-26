"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ChevronLeft, Plus, Edit2, Trash2, Save } from "@/components/icons"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
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
import { useAuth } from "@/lib/auth/context"

interface Product {
  id: string
  name: string
  definition: string
  handles: string
  notHandles: string
  status: "draft" | "final" | "deprecated"
}

const initialProducts: Product[] = [
  {
    id: "epoch",
    name: "Epoch",
    definition: "判断と行為を、不可逆な時間の層として記録する",
    handles: "個人の判断・行為の履歴記録、沈黙期間の可視化、スカウト機能",
    notHandles: "評価、制裁、判断の正否",
    status: "final",
  },
  {
    id: "sigil",
    name: "Sigil",
    definition: "術式を事前に開示する",
    handles: "アルゴリズム・ルールの公開、バージョン管理、採用通知",
    notHandles: "術式の正当性評価、強制適用",
    status: "final",
  },
  {
    id: "talisman",
    name: "Talisman",
    definition: "同一人物性を観測する",
    handles: "認証手段の登録、Credentialスコア、セキュリティ設定",
    notHandles: "本人の評価、信用スコア",
    status: "final",
  },
  {
    id: "pact",
    name: "Pact",
    definition: "雇用・報酬・契約状態遷移を確定させる",
    handles: "契約状態の記録、報酬台帳、状態遷移の追跡",
    notHandles: "契約内容の正当性評価",
    status: "final",
  },
]

export default function LibraryAdminPage() {
  const router = useRouter()
  const { isAdmin } = useAuth()
  
  const [products, setProducts] = useState<Product[]>(initialProducts)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [isNew, setIsNew] = useState(false)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  
  const [formId, setFormId] = useState("")
  const [formName, setFormName] = useState("")
  const [formDefinition, setFormDefinition] = useState("")
  const [formHandles, setFormHandles] = useState("")
  const [formNotHandles, setFormNotHandles] = useState("")
  const [formStatus, setFormStatus] = useState<"draft" | "final" | "deprecated">("draft")

  if (!isAdmin) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-16 text-center">
        <p className="text-muted-foreground">この機能は開発者のみアクセスできます</p>
        <Link href="/site/library">
          <Button variant="outline" className="mt-4 bg-transparent">戻る</Button>
        </Link>
      </div>
    )
  }

  const handleNew = () => {
    setIsNew(true)
    setEditingProduct(null)
    setFormId("")
    setFormName("")
    setFormDefinition("")
    setFormHandles("")
    setFormNotHandles("")
    setFormStatus("draft")
  }

  const handleEdit = (product: Product) => {
    setIsNew(false)
    setEditingProduct(product)
    setFormId(product.id)
    setFormName(product.name)
    setFormDefinition(product.definition)
    setFormHandles(product.handles)
    setFormNotHandles(product.notHandles)
    setFormStatus(product.status)
  }

  const handleSave = () => {
    const newProduct: Product = {
      id: formId,
      name: formName,
      definition: formDefinition,
      handles: formHandles,
      notHandles: formNotHandles,
      status: formStatus,
    }

    if (isNew) {
      setProducts([...products, newProduct])
    } else {
      setProducts(products.map(p => p.id === editingProduct?.id ? newProduct : p))
    }
    
    setEditingProduct(null)
    setIsNew(false)
  }

  const handleDelete = () => {
    if (deleteId) {
      setProducts(products.filter(p => p.id !== deleteId))
      setDeleteId(null)
    }
  }

  const statusColors = {
    draft: "bg-yellow-500/10 text-yellow-500",
    final: "bg-green-500/10 text-green-500",
    deprecated: "bg-red-500/10 text-red-500",
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={() => router.back()} className="h-8 w-8">
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-xl font-semibold text-foreground">Library 管理</h1>
            <p className="text-sm text-muted-foreground">プロダクトの追加・編集</p>
          </div>
        </div>
        <Button onClick={handleNew} className="gap-2">
          <Plus className="h-4 w-4" />
          新規追加
        </Button>
      </div>

      <div className="space-y-3">
        {products.map((product) => (
          <Card key={product.id}>
            <CardContent className="py-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-medium text-foreground">{product.name}</h3>
                    <Badge variant="outline" className={statusColors[product.status]}>
                      {product.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">{product.definition}</p>
                </div>
                <div className="flex items-center gap-1">
                  <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleEdit(product)}>
                    <Edit2 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-destructive hover:text-destructive"
                    onClick={() => setDeleteId(product.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={!!editingProduct || isNew} onOpenChange={() => { setEditingProduct(null); setIsNew(false) }}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{isNew ? "新規プロダクト追加" : "プロダクトを編集"}</DialogTitle>
            <DialogDescription>プロダクト情報を入力してください</DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="id">ID</Label>
                <Input id="id" value={formId} onChange={(e) => setFormId(e.target.value)} placeholder="epoch" disabled={!isNew} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="name">名前</Label>
                <Input id="name" value={formName} onChange={(e) => setFormName(e.target.value)} placeholder="Epoch" />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="definition">定義</Label>
              <Input id="definition" value={formDefinition} onChange={(e) => setFormDefinition(e.target.value)} placeholder="このプロダクトが何をするか" />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="handles">扱うこと</Label>
              <Textarea id="handles" value={formHandles} onChange={(e) => setFormHandles(e.target.value)} placeholder="このプロダクトが扱う範囲" rows={3} />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="notHandles">扱わないこと</Label>
              <Textarea id="notHandles" value={formNotHandles} onChange={(e) => setFormNotHandles(e.target.value)} placeholder="このプロダクトが扱わない範囲" rows={3} />
            </div>
            
            <div className="space-y-2">
              <Label>ステータス</Label>
              <Select value={formStatus} onValueChange={(v) => setFormStatus(v as typeof formStatus)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="final">Final</SelectItem>
                  <SelectItem value="deprecated">Deprecated</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => { setEditingProduct(null); setIsNew(false) }} className="bg-transparent">キャンセル</Button>
            <Button onClick={handleSave} disabled={!formId || !formName} className="gap-2">
              <Save className="h-4 w-4" />
              保存
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>プロダクトを削除しますか？</AlertDialogTitle>
            <AlertDialogDescription>この操作は取り消せません。</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>キャンセル</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">削除</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
