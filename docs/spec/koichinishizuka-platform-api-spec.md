# koichinishizuka.com Platform API 仕様書
Version 1.0  
Status: Final / Implementation-Complete Spec

---

## 0. 目的

第三者が **あなたのプロダクト群の能力を組み合わせて自分のプロダクトを作れる** 状態を固定する。  
入口（認証）→ 権限（スコープ）→ 実行（API 呼び出し）→ 課金／停止（entitlement）を一本の線で結ぶ。

ここに書いていない仕様は **存在しない**。

---

## 1. 登場主体

・Developer（第三者）  
・koichinishizuka.com（入口 / 認証 / Key 管理）  
・Talisman（本人性 / 一意性）  
・Product APIs（Epoch / Pact / Sigil / Talisman / Spell）

責任は分離される。

---

## 2. 絶対原則

・入口は **koichinishizuka.com ログインに統一**  
・権限は **Scope** でのみ付与  
・Scope 付与は **条件付き**（課金・審査・公開範囲）  
・実行は **短命トークン** のみで許可  
・課金は **呼び出した瞬間に発生**  
・停止は **Scope 剥奪 / Key 失効** で一撃

---

## 3. 認証フロー（入口）

1. Developer が koichinishizuka.com でログイン  
2. Talisman が本人性を確立  
3. Developer は「同一人物として認証された状態」になる

ログインは入口のみを統一する。  

---

## 4. Developer Key

Developer Key は長命の識別子であり、**API 呼び出しには直接使わない**。

・複数作成可能  
・用途別に分割可能  
・失効可能  
・ローテーション可能

Developer Key は **短命トークン発行のためだけ**に使用する。

---

## 5. Scope と Entitlement

### 5.1 Scope 一覧（例）

・talisman.verify（本人性シグナル参照）  
・pact.read / pact.write（契約状態の読取 / 遷移）  
・epoch.append / epoch.read（記録の追記 / 閲覧）  
・sigil.issue / sigil.verify（証明の発行 / 検証）  
・spell.check（実行可否照会）

### 5.2 付与条件

Scope 付与は必ず条件付き。

・無料枠  
・従量課金  
・審査  
・公開範囲

**チェックを入れたら即使える** は禁止。

### 5.3 Entitlement の真実点

Entitlement が **唯一の真実点**。

・Scope 付与 = Entitlement 付与  
・Scope 剥奪 = Entitlement 剥奪  
・Token は権限ではない

---

## 6. トークン発行と自動更新

短命トークンのみが API 呼び出しに使われる。

推奨設定（固定）:

・access_token: 60分  
・refresh_token: 30日  
・最大連続更新: 30日（再ログイン必須）

更新時に必ずチェックされる:

・課金状態  
・Entitlement  
・Scope 許可  
・Key 失効

いずれかが No の場合、**更新されずに停止**。

---

## 7. リクエスト処理

Authorization ヘッダー:

```
Authorization: Bearer <access_token>
```

各 API は **毎回** Entitlement を確認する。

・Token が有効でも Scope が剥奪されていれば 403  
・Token 無効なら 401  
・課金条件未達なら 403（reason=billing_required）

---

## 8. 課金（従量）

・呼び出した瞬間に課金対象  
・成功 / 失敗は課金に影響しない  
・メーターは Scope 単位で記録

トラブルを避けるため **「呼んだ=課金」** に固定する。

---

## 9. 停止（最重要）

停止は 2 通りだけ。

・Scope 剥奪  
・Developer Key 失効

いずれも **即時に全呼び出しが拒否**される。

---

## 10. エンドポイント（v1）

### 認証 / Key

```
POST /v1/auth/login
POST /v1/developer-keys
GET  /v1/developer-keys
POST /v1/developer-keys/{key_id}/rotate
POST /v1/developer-keys/{key_id}/revoke
```

### Scope

```
POST /v1/developer-keys/{key_id}/scopes
GET  /v1/developer-keys/{key_id}/scopes
```

### Token

```
POST /v1/tokens
POST /v1/tokens/refresh
POST /v1/token        (alias)
```

### Product APIs（例）

```
POST /v1/epoch/append      (epoch.append)
GET  /v1/epoch/read        (epoch.read)
POST /v1/pact/transition   (pact.write)
GET  /v1/pact/state        (pact.read)
POST /v1/sigil/issue       (sigil.issue)
POST /v1/sigil/verify      (sigil.verify)
POST /v1/talisman/verify   (talisman.verify)
POST /v1/spell/check  (spell.check)
```

---

## 11. Done 定義

以下を満たした時点で本仕様は完成。

・koichinishizuka.com が入口として機能  
・Developer Key 発行が可能  
・Scope 付与が条件付きで運用可能  
・短命トークンが自動更新される  
・各 API が Entitlement で確実に遮断できる  
・呼び出し単位の課金が成立
