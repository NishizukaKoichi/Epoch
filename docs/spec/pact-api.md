# Pact API 仕様書
Version 1.0  
Status: Final / Implementation-Complete Spec

---

## 0. 目的

Pact の状態遷移（雇用維持 / 警告 / 危機 / 終了）を  
**数値ログと閾値のみ**で確定させるための API を定義する。

---

## 1. 原則

- 自由記述は保存しない（定型のみ）
- Ledger は append-only
- 状態遷移は server が決定し、人は決定しない
- DELETE / UPDATE は存在しない

---

## 2. エンドポイント

### 2.1 Employees

```
POST /v1/pact/employees
GET  /v1/pact/employees
GET  /v1/pact/employees/{employee_id}
```

### 2.2 Thresholds

```
POST /v1/pact/thresholds
GET  /v1/pact/thresholds
GET  /v1/pact/thresholds/{role_id}
```

### 2.3 Ledger

```
POST /v1/pact/ledger
GET  /v1/pact/ledger
```

### 2.4 Transitions

```
GET /v1/pact/transitions
```

### 2.5 Reports

```
POST /v1/pact/reports/generate
GET  /v1/pact/reports
GET  /v1/pact/reports/{report_id}
```

### 2.6 My (本人閲覧)

```
GET /v1/pact/my
```

---

## 3. リクエスト / レスポンス（代表）

### POST /v1/pact/employees

```json
{
  "display_name": "Jane Doe",
  "role_id": "uuidv7",
  "hired_at": "2025-01-01"
}
```

### POST /v1/pact/thresholds

```json
{
  "role_id": "uuidv7",
  "period_days": 90,
  "min_threshold": 0.6,
  "warning_threshold": 0.5,
  "critical_threshold": 0.3,
  "growth_threshold": 0.85
}
```

### POST /v1/pact/ledger

```json
{
  "employee_id": "uuidv7",
  "metric_key": "kpi.on_time_rate",
  "metric_value": 0.92,
  "period_start": "2025-07-01",
  "period_end": "2025-09-30"
}
```

### POST /v1/pact/reports/generate

```json
{
  "employee_id": "uuidv7",
  "period_start": "2025-07-01",
  "period_end": "2025-09-30"
}
```

---

## 4. 状態遷移の決定

- 遷移は Ledger 追加時または定期評価で server が決定
- `from_state` / `to_state` は閾値ロジックのみで算出
- UI からの強制遷移は不可

---

## 5. エラー方針

- 400: 欠損 / 不正入力
- 401: 未認証
- 403: 権限不足
- 404: 存在しない
- 409: 状態不整合（閾値未設定など）

---

## 6. 禁止事項

- DELETE /v1/pact/*
- 手動遷移 API
- 自由記述の評価ログ

---

## 7. Done

- Ledger 追記で遷移が決まる
- 閾値の変更が履歴として残る
- Report が生成される
