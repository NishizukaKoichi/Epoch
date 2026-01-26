"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { 
  Shield, 
  ChevronLeft, 
  Fingerprint, 
  Mail, 
  Phone, 
  Globe, 
  Key,
  Check,
  Lock,
  ArrowRight
} from "@/components/icons"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/lib/auth/context"
import { useI18n } from "@/lib/i18n/context"

// Mock: 登録済みの認証手段（実際はAPIから取得）
const mockRegisteredCredentials = [
  { id: "cred-1", type: "passkey", label: "MacBook Pro", icon: Fingerprint, verified: true },
  { id: "cred-2", type: "email", label: "k•••@example.com", icon: Mail, verified: true },
  { id: "cred-3", type: "phone", label: "+81 90 •••• ••12", icon: Phone, verified: true },
]

// セキュリティ設定（実際はユーザー設定から取得）
const mockSecuritySetting = {
  requiredFactors: 1, // 1 = 単一認証、2 = 二要素認証
}

export default function TalismanLoginPage() {
  const { t } = useI18n()
  const router = useRouter()
  const { login } = useAuth()
  
  const [selectedCredentials, setSelectedCredentials] = useState<string[]>([])
  const [step, setStep] = useState<"select" | "verify">("select")
  const [verifying, setVerifying] = useState(false)
  const [emailCode, setEmailCode] = useState("")
  
  const requiredFactors = mockSecuritySetting.requiredFactors
  const canProceed = selectedCredentials.length >= requiredFactors

  const toggleCredential = (id: string) => {
    setSelectedCredentials(prev => 
      prev.includes(id) 
        ? prev.filter(c => c !== id)
        : [...prev, id]
    )
  }

  const handleVerify = async () => {
    setVerifying(true)
    
    // Mock: 認証処理
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    // ログイン成功
    login()
    router.push("/talisman")
  }

  const handleProceedToVerify = () => {
    setStep("verify")
  }

  const selectedCredentialData = mockRegisteredCredentials.filter(
    c => selectedCredentials.includes(c.id)
  )

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border">
        <div className="mx-auto flex h-12 max-w-md items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => router.back()}
              className="h-8 w-8 text-muted-foreground hover:text-foreground"
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <Shield className="h-5 w-5 text-cyan-400" />
            <span className="font-semibold text-foreground">Talisman</span>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-md px-4 py-8">
        {step === "select" ? (
          <>
            {/* Title */}
            <div className="mb-8 text-center">
              <h1 className="text-2xl font-light text-foreground mb-2">ログイン</h1>
              <p className="text-sm text-muted-foreground">
                登録済みの認証手段を選択してください
              </p>
              {requiredFactors > 1 && (
                <Badge variant="outline" className="mt-2 text-amber-500 border-amber-500">
                  <Lock className="h-3 w-3 mr-1" />
                  {requiredFactors}つの認証が必要
                </Badge>
              )}
            </div>

            {/* Registered Credentials */}
            <div className="space-y-3 mb-8">
              {mockRegisteredCredentials.map((credential) => {
                const Icon = credential.icon
                const isSelected = selectedCredentials.includes(credential.id)
                
                return (
                  <Card
                    key={credential.id}
                    className={`cursor-pointer transition-all ${
                      isSelected 
                        ? "border-cyan-500 bg-cyan-500/5" 
                        : "border-border hover:border-muted-foreground/50"
                    }`}
                    onClick={() => toggleCredential(credential.id)}
                  >
                    <CardContent className="flex items-center justify-between p-4">
                      <div className="flex items-center gap-3">
                        <div className={`h-10 w-10 rounded-lg flex items-center justify-center ${
                          isSelected ? "bg-cyan-500/20" : "bg-muted"
                        }`}>
                          <Icon className={`h-5 w-5 ${isSelected ? "text-cyan-500" : "text-muted-foreground"}`} />
                        </div>
                        <div>
                          <p className="font-medium text-sm text-foreground">{credential.label}</p>
                          <p className="text-xs text-muted-foreground capitalize">{credential.type}</p>
                        </div>
                      </div>
                      {isSelected && (
                        <div className="h-6 w-6 rounded-full bg-cyan-500 flex items-center justify-center">
                          <Check className="h-4 w-4 text-white" />
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )
              })}
            </div>

            {/* Proceed Button */}
            <Button
              className="w-full bg-cyan-500 hover:bg-cyan-600 text-white gap-2"
              disabled={!canProceed}
              onClick={handleProceedToVerify}
            >
              {canProceed 
                ? `${selectedCredentials.length}つの認証で続ける`
                : `認証手段を${requiredFactors}つ以上選択`
              }
              {canProceed && <ArrowRight className="h-4 w-4" />}
            </Button>

            {/* Links */}
            <div className="mt-6 text-center space-y-2">
              <p className="text-sm text-muted-foreground">
                アカウントをお持ちでない場合は
              </p>
              <Link href="/talisman/credentials/new" className="text-sm text-cyan-500 hover:underline">
                新規登録
              </Link>
            </div>
          </>
        ) : (
          <>
            {/* Verify Step */}
            <div className="mb-8 text-center">
              <h1 className="text-2xl font-light text-foreground mb-2">認証</h1>
              <p className="text-sm text-muted-foreground">
                選択した認証手段で本人確認を行います
              </p>
            </div>

            <div className="space-y-4">
              {selectedCredentialData.map((credential) => {
                const Icon = credential.icon
                
                return (
                  <Card key={credential.id}>
                    <CardHeader className="pb-3">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-lg bg-cyan-500/10 flex items-center justify-center">
                          <Icon className="h-5 w-5 text-cyan-500" />
                        </div>
                        <div>
                          <CardTitle className="text-sm">{credential.label}</CardTitle>
                          <CardDescription className="text-xs capitalize">{credential.type}</CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      {credential.type === "passkey" && (
                        <Button 
                          variant="outline" 
                          className="w-full bg-transparent"
                          onClick={handleVerify}
                          disabled={verifying}
                        >
                          <Fingerprint className="h-4 w-4 mr-2" />
                          {verifying ? "認証中..." : "パスキーで認証"}
                        </Button>
                      )}
                      {credential.type === "email" && (
                        <div className="space-y-3">
                          <p className="text-xs text-muted-foreground">
                            メールアドレスに認証コードを送信しました
                          </p>
                          <div className="flex gap-2">
                            <Input
                              placeholder="認証コード"
                              value={emailCode}
                              onChange={(e) => setEmailCode(e.target.value)}
                              className="flex-1"
                            />
                            <Button 
                              onClick={handleVerify}
                              disabled={verifying || emailCode.length < 6}
                              className="bg-cyan-500 hover:bg-cyan-600 text-white"
                            >
                              {verifying ? "..." : "確認"}
                            </Button>
                          </div>
                        </div>
                      )}
                      {credential.type === "phone" && (
                        <div className="space-y-3">
                          <p className="text-xs text-muted-foreground">
                            SMSで認証コードを送信しました
                          </p>
                          <div className="flex gap-2">
                            <Input
                              placeholder="認証コード"
                              className="flex-1"
                            />
                            <Button 
                              onClick={handleVerify}
                              disabled={verifying}
                              className="bg-cyan-500 hover:bg-cyan-600 text-white"
                            >
                              {verifying ? "..." : "確認"}
                            </Button>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )
              })}
            </div>

            <Button
              variant="ghost"
              className="w-full mt-4"
              onClick={() => setStep("select")}
            >
              戻る
            </Button>
          </>
        )}
      </main>
    </div>
  )
}
