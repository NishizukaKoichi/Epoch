# Spell API 仕様書
Version 1.0  
Status: Final / Implementation-Complete Spec

---

## 0. 目的

Spell が **実行可否の真実点**として機能するための API を固定する。  
処理内容・価格・実行結果は扱わない。

---

## 1. 原則

- Entitlement が唯一の真実点
- Scope Check は呼び出し単位で課金
- Webhook-only（Stripe 以外の決済確定は扱わない）
- 実行可否は Yes / No のみ

---

## 2. エンドポイント

### 2.1 Runtime Check

```
POST /v1/spell/check
```

入力: spell_id, runtime_id, user_identifier, requested_scope  
出力: allowed (true | false)

### 2.2 Spells

```
POST /v1/spell/spells
GET  /v1/spell/spells
GET  /v1/spell/spells/{spell_id}
POST /v1/spell/spells/{spell_id}/status
```

### 2.3 Scopes

```
POST /v1/spell/scopes
GET  /v1/spell/scopes
```

### 2.4 Entitlements

```
GET /v1/spell/entitlements
```

### 2.5 Audit / Reconcile

```
GET  /v1/spell/audit
POST /v1/spell/reconcile
```

### 2.6 Webhook

```
POST /v1/spell/webhooks/stripe
```

---

## 3. リクエスト例

### POST /v1/spell/check

```json
{
  "spell_id": "spell_001",
  "runtime_id": "runtime_abc",
  "user_identifier": "user_123",
  "requested_scope": "premium:execute"
}
```

---

## 4. エラー方針

- 400: 欠損 / 不正入力
- 401: 未認証
- 403: Scope / Entitlement 不足
- 404: spell が存在しない
- 409: 状態不整合

---

## 5. 禁止事項

- 実行結果の保存
- 価格や回数の評価 API
- Scope Check 以外の裁量判断

---

## 6. Done

- Scope Check が常に Yes / No を返す
- Webhook で Entitlement が更新される
- 呼び出し単位の課金が記録される
