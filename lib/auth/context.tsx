"use client"

import { createContext, useContext, useState, type ReactNode } from "react"

export interface Credential {
  id: string
  type: "passkey" | "email" | "phone" | "oauth" | "recovery"
  label: string
  verifiedAt: string
}

interface AuthContextType {
  isLoggedIn: boolean
  isRegistered: boolean // アカウント登録済みか
  isAdmin: boolean // koichinishizuka.com の管理者かどうか
  userId: string | null
  credentials: Credential[]
  credentialCount: number
  hasMinimumCredentials: boolean // 3つ以上のCredentialがあるか
  login: () => void
  logout: () => void
  register: (initialCredential: Credential) => void // 新規登録（最初の認証手段を同時に登録）
  addCredential: (credential: Credential) => void
}

const AuthContext = createContext<AuthContextType | null>(null)

// デモ用: 登録済みユーザーの認証手段（実際はDB/APIから取得）
const mockRegisteredCredentials: Credential[] = [
  { id: "cred-1", type: "passkey", label: "MacBook Pro", verifiedAt: "2025-01-15T10:00:00Z" },
  { id: "cred-2", type: "email", label: "koichi@example.com", verifiedAt: "2025-01-10T08:00:00Z" },
  { id: "cred-3", type: "phone", label: "+81 90-****-1234", verifiedAt: "2025-01-12T14:00:00Z" },
]

// 管理者のユーザーID（koichinishizuka本人）
const ADMIN_USER_ID = "koichinishizuka"

export function AuthProvider({ children }: { children: ReactNode }) {
  // デモ用: 初期状態を設定（実際は未登録・未ログイン状態から始まる）
  const [isRegistered, setIsRegistered] = useState(true)
  const [isLoggedIn, setIsLoggedIn] = useState(true)
  const [userId, setUserId] = useState<string | null>(ADMIN_USER_ID) // デモ用: 管理者としてログイン
  const [credentials, setCredentials] = useState<Credential[]>(mockRegisteredCredentials)
  
  // 管理者判定: ログイン中かつユーザーIDが管理者と一致
  const isAdmin = isLoggedIn && userId === ADMIN_USER_ID

  const credentialCount = credentials.length
  const hasMinimumCredentials = credentialCount >= 3

  // 新規登録: 最初の認証手段を使って登録 → そのままその認証手段が1つ目のCredentialになる
  const register = (initialCredential: Credential) => {
    const newUserId = `user-${Date.now()}` // 実際はサーバーで生成
    setUserId(newUserId)
    setCredentials([initialCredential])
    setIsRegistered(true)
    setIsLoggedIn(true)
  }

  const login = () => {
    setIsLoggedIn(true)
    // 登録済みのCredentialを復元（実際はAPIから取得）
    if (credentials.length === 0) {
      setCredentials(mockRegisteredCredentials)
    }
    // デモ用: ログイン時は管理者としてログイン
    setUserId(ADMIN_USER_ID)
  }

  const logout = () => {
    setIsLoggedIn(false)
    setUserId(null)
    // Credentialはログアウトしても保持（登録済み状態は維持）
  }

  const addCredential = (credential: Credential) => {
    setCredentials((prev) => [...prev, credential])
  }

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn,
        isRegistered,
        isAdmin,
        userId,
        credentials,
        credentialCount,
        hasMinimumCredentials,
        login,
        logout,
        register,
        addCredential,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
