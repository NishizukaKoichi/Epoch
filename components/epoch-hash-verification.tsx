"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { CheckCircle2, XCircle, AlertTriangle, ChevronDown, ChevronUp, Shield, Link2 } from "@/components/icons"

interface Record {
  id: string
  hash: string
  prevHash: string
  timestamp: string
  type: string
}

interface VerificationResult {
  recordId: string
  isValid: boolean
  expectedPrevHash: string
  actualPrevHash: string
}

interface EpochHashVerificationProps {
  records: Record[]
}

export function EpochHashVerification({ records }: EpochHashVerificationProps) {
  const [isVerifying, setIsVerifying] = useState(false)
  const [verificationComplete, setVerificationComplete] = useState(false)
  const [results, setResults] = useState<VerificationResult[]>([])
  const [showDetails, setShowDetails] = useState(false)

  const verifyChain = async () => {
    setIsVerifying(true)
    setVerificationComplete(false)

    // Simulate verification process
    await new Promise((resolve) => setTimeout(resolve, 1500))

    const verificationResults: VerificationResult[] = []

    for (let i = 0; i < records.length; i++) {
      const record = records[i]
      const prevRecord = records[i + 1]

      if (i === records.length - 1) {
        // First record (genesis)
        verificationResults.push({
          recordId: record.id,
          isValid: record.prevHash === "0000000000000000000000000000000",
          expectedPrevHash: "0000000000000000000000000000000",
          actualPrevHash: record.prevHash,
        })
      } else {
        verificationResults.push({
          recordId: record.id,
          isValid: record.prevHash === prevRecord.hash,
          expectedPrevHash: prevRecord.hash,
          actualPrevHash: record.prevHash,
        })
      }
    }

    setResults(verificationResults)
    setIsVerifying(false)
    setVerificationComplete(true)
  }

  const allValid = results.every((r) => r.isValid)
  const invalidCount = results.filter((r) => !r.isValid).length

  return (
    <div className="border border-border bg-card p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Shield className="h-5 w-5 text-foreground" />
          <div>
            <h3 className="text-base font-medium text-foreground">Hash Chain 検証</h3>
            <p className="text-xs text-muted-foreground mt-0.5">Recordの連鎖整合性を検証します</p>
          </div>
        </div>
        <Button
          onClick={verifyChain}
          disabled={isVerifying}
          variant="outline"
          className="border-border text-foreground hover:bg-muted bg-transparent"
        >
          {isVerifying ? (
            <>
              <span className="animate-spin mr-2">◌</span>
              検証中...
            </>
          ) : (
            "検証を実行"
          )}
        </Button>
      </div>

      {verificationComplete && (
        <div className="space-y-4">
          {/* Summary */}
          <div
            className={`flex items-center gap-3 p-4 border ${
              allValid ? "border-green-500/30 bg-green-500/10" : "border-red-500/30 bg-red-500/10"
            }`}
          >
            {allValid ? (
              <CheckCircle2 className="h-5 w-5 text-green-500" />
            ) : (
              <XCircle className="h-5 w-5 text-red-500" />
            )}
            <div>
              <p className={`font-medium ${allValid ? "text-green-500" : "text-red-500"}`}>
                {allValid ? "全てのRecordが検証に合格しました" : `${invalidCount}件のRecordで不整合を検出`}
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">検証対象: {records.length} records</p>
            </div>
          </div>

          {/* Visualization */}
          <div className="flex items-center gap-1 overflow-x-auto py-2">
            {results.map((result, index) => (
              <div key={result.recordId} className="flex items-center">
                <div
                  className={`w-3 h-3 rounded-full ${result.isValid ? "bg-green-500" : "bg-red-500"}`}
                  title={`Record ${index + 1}: ${result.isValid ? "Valid" : "Invalid"}`}
                />
                {index < results.length - 1 && (
                  <Link2 className={`h-3 w-6 ${result.isValid ? "text-green-500/50" : "text-red-500/50"}`} />
                )}
              </div>
            ))}
          </div>

          {/* Details toggle */}
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            {showDetails ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
            詳細を{showDetails ? "隠す" : "表示"}
          </button>

          {/* Detailed results */}
          {showDetails && (
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {results.map((result, index) => (
                <div
                  key={result.recordId}
                  className={`p-3 border text-xs font-mono ${
                    result.isValid ? "border-border bg-muted/30" : "border-red-500/30 bg-red-500/10"
                  }`}
                >
                  <div className="flex items-center gap-2 mb-2">
                    {result.isValid ? (
                      <CheckCircle2 className="h-3 w-3 text-green-500" />
                    ) : (
                      <XCircle className="h-3 w-3 text-red-500" />
                    )}
                    <span className="text-foreground">Record #{records.length - index}</span>
                  </div>
                  <div className="space-y-1 text-muted-foreground">
                    <div className="flex gap-2">
                      <span className="w-24">record_id:</span>
                      <span className="break-all">{result.recordId}</span>
                    </div>
                    <div className="flex gap-2">
                      <span className="w-24">prev_hash:</span>
                      <span className="break-all">{result.actualPrevHash}</span>
                    </div>
                    {!result.isValid && (
                      <div className="flex gap-2 text-red-400">
                        <span className="w-24">expected:</span>
                        <span className="break-all">{result.expectedPrevHash}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {!allValid && (
            <div className="flex items-start gap-3 p-4 bg-amber-500/10 border border-amber-500/20">
              <AlertTriangle className="h-5 w-5 text-amber-500 flex-shrink-0" />
              <div className="text-sm">
                <p className="text-amber-500 font-medium">整合性エラー</p>
                <p className="text-muted-foreground mt-1">
                  Hash
                  Chainに不整合が検出されました。これはデータの改ざんまたはシステムエラーを示している可能性があります。
                  サポートに連絡してください。
                </p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
