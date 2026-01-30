# Sigil API 仕様書
Version 1.0  
Status: Final / Implementation-Complete Spec

---

## 0. 目的

Sigil の UI と仕様本文（術式）を **固定された API** で読み書きできる状態を定義する。  
扱うのは術式の構造と公開状態のみであり、評価や推薦は行わない。

---

## 1. 原則

- 人の内面評価は扱わない
- 章本文は **更新ではなく新規リビジョン** として追記する
- 公開可否は status で固定（draft / final / deprecated）
- 削除 API は存在しない

---

## 2. 認証区分

### 2.1 認証必須
- space 作成 / 編集
- chapter 追加 / 編集
- adoption 記録
- issue / verify
- analytics / settings

### 2.2 公開アクセス可
- explore
- reader
- 公開された space / chapter の取得

---

## 3. エンドポイント

### 3.1 Space

```
POST /v1/sigil/spaces
GET  /v1/sigil/spaces
GET  /v1/sigil/spaces/{space_id}
POST /v1/sigil/spaces/{space_id}/revisions
POST /v1/sigil/spaces/{space_id}/publish
```

Space は container。本文の変更は revision 追加で行う。

### 3.2 Chapter

```
POST /v1/sigil/chapters
GET  /v1/sigil/chapters/{chapter_id}
POST /v1/sigil/chapters/{chapter_id}/revisions
```

Chapter の本文更新は revision 追加のみ。

### 3.3 Explore / Reader

```
GET /v1/sigil/explore
GET /v1/sigil/reader/{space_id}
```

公開済みの space のみ取得可能。

### 3.4 Adoption

```
POST /v1/sigil/spaces/{space_id}/adopt
GET  /v1/sigil/adoptions
```

adopt は「読了 / 受け入れ / 拒否」の状態を記録する。

### 3.5 Issue / Verify

```
POST /v1/sigil/issue
POST /v1/sigil/verify
```

issue は「特定の space revision に対する証明」を生成する。  
verify は署名の検証結果のみを返す（評価は行わない）。

### 3.6 Analytics

```
GET /v1/sigil/analytics/{space_id}
```

返すのは **数量のみ**（閲覧数、adoption 数、最新 revision など）。

---

## 4. リクエスト / レスポンス（代表）

### POST /v1/sigil/spaces

```json
{
  "title": "術式名",
  "purpose": "目的",
  "visibility": "public"
}
```

### POST /v1/sigil/chapters

```json
{
  "space_id": "uuidv7",
  "order_index": 1,
  "title": "前提条件",
  "body": "本文"
}
```

### POST /v1/sigil/spaces/{space_id}/adopt

```json
{
  "status": "accepted"
}
```

### POST /v1/sigil/issue

```json
{
  "space_id": "uuidv7",
  "revision_id": "uuidv7",
  "subject_user_id": "uuidv7"
}
```

---

## 5. エラー方針

- 400: 欠損 / 不正入力
- 401: 未認証
- 403: 権限不足 / 非公開
- 404: 存在しない
- 409: 状態不整合（公開済みを再 publish など）

---

## 6. 禁止事項

- DELETE /v1/sigil/*
- 本文更新の上書き
- 評価やランキングの API

---

## 7. Done

以下が成立した時点で Sigil API は完成。

- revision 追記でのみ本文が更新される
- public reader が取得可能
- adoption が記録される
- issue / verify が動作する
