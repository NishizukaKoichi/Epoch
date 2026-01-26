"use client"

import Link from "next/link"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { ChevronDown, User, Check, Plus, Building2 } from "@/components/icons"

// 現在従事している組織（兼業・副業で複数の場合あり）
interface CurrentOrganization {
  id: string
  name: string
  role: string
}

interface EpochContextSwitcherProps {
  currentContext: "personal" | { orgId: string; orgName: string }
  currentOrganizations: CurrentOrganization[] // 現在従事している組織（複数可）
  onSwitch: (context: "personal" | string) => void
}

export function EpochContextSwitcher({
  currentContext,
  currentOrganizations,
  onSwitch,
}: EpochContextSwitcherProps) {
  const isPersonal = currentContext === "personal"
  const currentOrg = !isPersonal
    ? currentOrganizations.find((o) => o.id === currentContext.orgId)
    : null

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="flex items-center gap-2 text-foreground hover:bg-secondary px-2 h-8"
        >
          {isPersonal ? (
            <>
              <div className="flex h-5 w-5 items-center justify-center rounded-full bg-secondary">
                <User className="h-3 w-3 text-muted-foreground" />
              </div>
              <span className="text-sm font-medium">個人</span>
            </>
          ) : (
            <>
              <div className="flex h-5 w-5 items-center justify-center rounded bg-primary/10 text-primary text-xs font-medium">
                {currentOrg?.name.slice(0, 1) || "O"}
              </div>
              <span className="text-sm font-medium truncate max-w-24">
                {currentOrg?.name || "組織"}
              </span>
            </>
          )}
          <ChevronDown className="h-3 w-3 text-muted-foreground" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-64 bg-card border-border">
        <DropdownMenuLabel className="text-xs text-muted-foreground font-normal">
          コンテキスト切り替え
        </DropdownMenuLabel>

        <DropdownMenuItem
          onClick={() => onSwitch("personal")}
          className="flex items-center justify-between cursor-pointer"
        >
          <div className="flex items-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-secondary">
              <User className="h-3.5 w-3.5 text-muted-foreground" />
            </div>
            <div>
              <p className="text-sm text-foreground">個人のEpoch</p>
              <p className="text-xs text-muted-foreground">自分の記録</p>
            </div>
          </div>
          {isPersonal && <Check className="h-4 w-4 text-primary" />}
        </DropdownMenuItem>

        {currentOrganizations.length > 0 ? (
          <>
            <DropdownMenuSeparator className="bg-border" />
            <DropdownMenuLabel className="text-xs text-muted-foreground font-normal">
              現在従事している組織
            </DropdownMenuLabel>
            {currentOrganizations.map((org) => (
              <DropdownMenuItem
                key={org.id}
                onClick={() => onSwitch(org.id)}
                className="flex items-center justify-between cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <div className="flex h-6 w-6 items-center justify-center rounded bg-primary/10 text-primary text-xs font-medium">
                    {org.name.slice(0, 1)}
                  </div>
                  <div>
                    <p className="text-sm text-foreground">{org.name}</p>
                    <p className="text-xs text-muted-foreground">{org.role}</p>
                  </div>
                </div>
                {!isPersonal && currentContext.orgId === org.id && (
                  <Check className="h-4 w-4 text-primary" />
                )}
              </DropdownMenuItem>
            ))}
          </>
        ) : (
          <>
            <DropdownMenuSeparator className="bg-border" />
            <div className="px-2 py-3 text-center">
              <Building2 className="h-5 w-5 mx-auto text-muted-foreground mb-2" />
              <p className="text-xs text-muted-foreground">
                現在、組織に所属していません
              </p>
            </div>
          </>
        )}

        <DropdownMenuSeparator className="bg-border" />
        <DropdownMenuItem asChild>
          <Link
            href="/browse/orgs"
            className="flex items-center gap-2 cursor-pointer text-muted-foreground"
          >
            <Plus className="h-4 w-4" />
            <span className="text-sm">組織を探す・作成</span>
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
