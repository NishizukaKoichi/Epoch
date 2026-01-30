"use client"

import { useEffect, useState, type ReactNode } from "react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, AlertTriangle, XCircle, Clock, Database, Server, Shield, Pen } from "@/components/icons"
import Link from "next/link"

type ServiceStatus = "operational" | "degraded" | "outage" | "maintenance"

interface ServiceInfo {
  name: string
  description: string
  status: ServiceStatus
  lastUpdated: string
  message?: string
}

interface IncidentInfo {
  id: string
  title: string
  status: "investigating" | "identified" | "monitoring" | "resolved"
  createdAt: string
  updatedAt: string
  updates: {
    timestamp: string
    message: string
  }[]
}


export function EpochStatusPage() {
  const [services, setServices] = useState<ServiceInfo[]>([])
  const [incidents, setIncidents] = useState<IncidentInfo[]>([])
  const [updatedAt, setUpdatedAt] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const serviceIcons: Record<string, ReactNode> = {
    Record書き込み: <Pen className="h-5 w-5" />,
    データベース: <Database className="h-5 w-5" />,
    認証サービス: <Shield className="h-5 w-5" />,
    APIサーバー: <Server className="h-5 w-5" />,
  }

  useEffect(() => {
    const load = async () => {
      setIsLoading(true)
      setError(null)
      try {
        const response = await fetch("/api/epoch/status")
        if (!response.ok) {
          const payload = await response.json().catch(() => null)
          throw new Error(payload?.error || "ステータスの取得に失敗しました")
        }
        const data = (await response.json()) as {
          services: ServiceInfo[]
          incidents: IncidentInfo[]
          updatedAt?: string
        }
        setServices(data.services ?? [])
        setIncidents(data.incidents ?? [])
        setUpdatedAt(data.updatedAt ?? null)
      } catch (err) {
        const message = err instanceof Error ? err.message : "ステータスの取得に失敗しました"
        setError(message)
      } finally {
        setIsLoading(false)
      }
    }
    load()
  }, [])
  const getStatusIcon = (status: ServiceStatus) => {
    switch (status) {
      case "operational":
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case "degraded":
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />
      case "outage":
        return <XCircle className="h-5 w-5 text-destructive" />
      case "maintenance":
        return <Clock className="h-5 w-5 text-muted-foreground" />
    }
  }

  const getStatusLabel = (status: ServiceStatus) => {
    switch (status) {
      case "operational":
        return "正常稼働"
      case "degraded":
        return "パフォーマンス低下"
      case "outage":
        return "障害発生中"
      case "maintenance":
        return "メンテナンス中"
    }
  }

  const getIncidentStatusLabel = (status: IncidentInfo["status"]) => {
    switch (status) {
      case "investigating":
        return "調査中"
      case "identified":
        return "原因特定"
      case "monitoring":
        return "監視中"
      case "resolved":
        return "解決済み"
    }
  }

  const allOperational = services.length > 0 && services.every((s) => s.status === "operational")
  const hasOutage = services.some((s) => s.status === "outage")

  const formatTimestamp = (iso: string) => {
    return new Date(iso).toLocaleString("ja-JP", {
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="mx-auto max-w-4xl px-4 py-6">
          <Link href="/epoch" className="text-lg font-medium tracking-tight text-foreground">
            Epoch
          </Link>
          <span className="ml-2 text-muted-foreground">/ ステータス</span>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-4 py-8">
        {/* Overall Status Banner */}
        <div
          className={`mb-8 p-6 rounded-md border ${
            hasOutage
              ? "bg-destructive/10 border-destructive/30"
              : allOperational
                ? "bg-green-500/10 border-green-500/30"
                : "bg-yellow-500/10 border-yellow-500/30"
          }`}
        >
          <div className="flex items-center gap-4">
            {hasOutage ? (
              <XCircle className="h-8 w-8 text-destructive" />
            ) : allOperational ? (
              <CheckCircle className="h-8 w-8 text-green-500" />
            ) : (
              <AlertTriangle className="h-8 w-8 text-yellow-500" />
            )}
            <div>
              <h1 className="text-xl font-medium text-foreground">
                {hasOutage
                  ? "一部のサービスに障害が発生しています"
                  : allOperational
                    ? "全てのシステムは正常に稼働しています"
                    : "一部のサービスでパフォーマンス低下が発生しています"}
              </h1>
              <p className="text-sm text-muted-foreground mt-1">
                最終更新: {formatTimestamp(updatedAt ?? new Date().toISOString())}
              </p>
            </div>
          </div>

          {hasOutage && (
            <div className="mt-4 p-4 bg-destructive/5 border border-destructive/20 rounded-md">
              <p className="text-sm text-foreground font-medium">
                Record書き込みが現在不可能です
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                障害が解消されるまで、新しいRecordを確定することはできません。
                下書きはローカルに保存されますが、確定操作は行わないでください。
              </p>
            </div>
          )}
        </div>

        {/* Services Status */}
        <Card className="bg-card border-border mb-8">
          <CardHeader>
            <CardTitle className="text-lg text-foreground">サービス状態</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {isLoading && <div className="text-sm text-muted-foreground">読み込み中...</div>}
              {error && (
                <div className="rounded border border-destructive/30 bg-destructive/10 px-3 py-2 text-xs text-destructive">
                  {error}
                </div>
              )}
              {services.map((service) => (
                <div
                  key={service.name}
                  className="flex items-center justify-between py-3 border-b border-border last:border-0"
                >
                  <div className="flex items-center gap-4">
                    <div className="text-muted-foreground">
                      {serviceIcons[service.name] ?? <Server className="h-5 w-5" />}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">{service.name}</p>
                      <p className="text-xs text-muted-foreground">{service.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {getStatusIcon(service.status)}
                    <span className="text-sm text-muted-foreground">
                      {getStatusLabel(service.status)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Incidents */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-lg text-foreground">過去のインシデント</CardTitle>
          </CardHeader>
          <CardContent>
            {incidents.length === 0 ? (
              <p className="text-sm text-muted-foreground">過去30日間にインシデントはありません。</p>
            ) : (
              <div className="space-y-6">
                {incidents.map((incident) => (
                  <div key={incident.id} className="border-b border-border pb-6 last:border-0">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-sm font-medium text-foreground">{incident.title}</h3>
                        <p className="text-xs text-muted-foreground mt-1">
                          {formatTimestamp(incident.createdAt)}
                        </p>
                      </div>
                      <span
                        className={`text-xs px-2 py-1 rounded-full ${
                          incident.status === "resolved"
                            ? "bg-green-500/10 text-green-500"
                            : "bg-yellow-500/10 text-yellow-500"
                        }`}
                      >
                        {getIncidentStatusLabel(incident.status)}
                      </span>
                    </div>
                    <div className="space-y-3">
                      {incident.updates.map((update, index) => (
                        <div key={index} className="flex gap-4">
                          <span className="text-xs font-mono text-muted-foreground shrink-0 w-24">
                            {formatTimestamp(update.timestamp)}
                          </span>
                          <p className="text-sm text-muted-foreground">{update.message}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Footer note */}
        <div className="mt-8 text-center text-xs text-muted-foreground">
          <p>
            障害発生時、Epochは「書き込み不可」を明示します。
            曖昧な状態での記録は行われません。
          </p>
        </div>
      </main>
    </div>
  )
}
