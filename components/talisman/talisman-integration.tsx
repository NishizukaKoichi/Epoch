"use client"

import { useState } from "react"
import { Copy, Check, Eye, EyeOff, RefreshCw, Code, Webhook, Shield } from "@/components/icons"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useI18n } from "@/lib/i18n/context"

const mockApiKey = "tls_live_a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6"

export function TalismanIntegration() {
  const { t } = useI18n()
  const [showApiKey, setShowApiKey] = useState(false)
  const [copied, setCopied] = useState(false)
  const [webhookUrl, setWebhookUrl] = useState("")

  const copyApiKey = () => {
    navigator.clipboard.writeText(mockApiKey)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="space-y-6">
      {/* Overview */}
      <Card>
        <CardHeader>
          <CardTitle>{t("talisman.integration.title")}</CardTitle>
          <CardDescription>{t("talisman.integration.desc")}</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Talisman can be used as a unified login infrastructure. Products can delegate authentication to Talisman
            and receive observation signals (score + flags) for their own judgment.
          </p>
        </CardContent>
      </Card>

      {/* API Key */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">{t("talisman.integration.api_key")}</CardTitle>
          <CardDescription>
            Use this key to authenticate API requests from your product.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Input
                type={showApiKey ? "text" : "password"}
                value={mockApiKey}
                readOnly
                className="pr-10 font-mono text-sm"
              />
              <button
                type="button"
                onClick={() => setShowApiKey(!showApiKey)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showApiKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            <Button variant="outline" size="icon" onClick={copyApiKey} className="bg-transparent">
              {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            </Button>
            <Button variant="outline" size="icon" className="bg-transparent">
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">
            Keep this key secret. Do not expose it in client-side code.
          </p>
        </CardContent>
      </Card>

      {/* Webhook */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Webhook className="h-5 w-5 text-muted-foreground" />
            <CardTitle className="text-base">{t("talisman.integration.webhook")}</CardTitle>
          </div>
          <CardDescription>
            Receive real-time notifications when events occur.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Webhook URL</Label>
            <Input
              type="url"
              placeholder="https://your-product.com/api/talisman/webhook"
              value={webhookUrl}
              onChange={(e) => setWebhookUrl(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label>Events to send</Label>
            <div className="space-y-2">
              {["person_created", "credential_added", "credential_revoked"].map((event) => (
                <label key={event} className="flex items-center gap-2">
                  <input type="checkbox" className="rounded border-border" defaultChecked />
                  <span className="text-sm">{t(`talisman.event.${event}`)}</span>
                </label>
              ))}
            </div>
          </div>
          <Button>Save Webhook</Button>
        </CardContent>
      </Card>

      {/* Policy Example */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-muted-foreground" />
            <CardTitle className="text-base">{t("talisman.integration.policy")}</CardTitle>
          </div>
          <CardDescription>{t("talisman.integration.policy_desc")}</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="mb-4 text-sm text-muted-foreground">
            Talisman does not enforce policies. Your product must implement its own logic based on the returned signals.
          </p>
          <div className="rounded-lg border border-border bg-muted/30 p-4 font-mono text-sm">
            <pre className="overflow-x-auto text-muted-foreground">
{`// Example: Your product's policy logic
const signal = await talisman.getSignal(personId);

if (signal.score >= 2 && signal.flags.has_payment) {
  // Allow full access
  grantAccess("full");
} else if (signal.score >= 1) {
  // Allow limited access
  grantAccess("limited");
} else {
  // Require additional verification
  requestVerification();
}`}
            </pre>
          </div>
          <p className="mt-4 text-xs text-muted-foreground">
            * This is just an example. Talisman never evaluates or enforces these conditions.
          </p>
        </CardContent>
      </Card>

      {/* API Reference */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Code className="h-5 w-5 text-muted-foreground" />
            <CardTitle className="text-base">API Reference</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Get Signal */}
          <div className="rounded-lg border border-border p-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="rounded bg-green-500/10 px-2 py-0.5 text-xs font-medium text-green-500">GET</span>
              <code className="text-sm">/persons/{'{person_id}'}/signal</code>
            </div>
            <p className="text-sm text-muted-foreground mb-3">Get observation signal for a person.</p>
            <div className="rounded bg-muted/50 p-3 font-mono text-xs">
              <pre className="overflow-x-auto text-muted-foreground">
{`{
  "person_id": "019426a2-7def-7e8a-9c1b-4f8e2a3b5c6d",
  "score": 3,
  "flags": {
    "has_email": true,
    "has_oauth": true,
    "has_payment": false
  }
}`}
              </pre>
            </div>
          </div>

          {/* Add Credential */}
          <div className="rounded-lg border border-border p-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="rounded bg-blue-500/10 px-2 py-0.5 text-xs font-medium text-blue-500">POST</span>
              <code className="text-sm">/credentials</code>
            </div>
            <p className="text-sm text-muted-foreground mb-3">Add a new credential to a person.</p>
            <div className="rounded bg-muted/50 p-3 font-mono text-xs">
              <pre className="overflow-x-auto text-muted-foreground">
{`{
  "person_id": "019426a2-...",
  "type": "email_magiclink",
  "raw_value": "user@example.com",
  "issuer": "your-product"
}`}
              </pre>
            </div>
          </div>

          {/* Revoke Credential */}
          <div className="rounded-lg border border-border p-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="rounded bg-blue-500/10 px-2 py-0.5 text-xs font-medium text-blue-500">POST</span>
              <code className="text-sm">/credentials/revoke</code>
            </div>
            <p className="text-sm text-muted-foreground mb-3">Revoke an existing credential.</p>
            <div className="rounded bg-muted/50 p-3 font-mono text-xs">
              <pre className="overflow-x-auto text-muted-foreground">
{`{
  "credential_id": "cred-xxx",
  "actor": "product"
}`}
              </pre>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
