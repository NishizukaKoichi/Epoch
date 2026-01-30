# UI → Backend Gap Matrix
Version 1.0  
Status: Working / Implementation Map

---

## 0. 前提

- koichinishizuka.com / Epoch / Sigil / Pact / Talisman / Spell は **別環境・別DB**
- 直接DB参照は禁止、連携は Platform API のみ

---

## 1. koichinishizuka.com（母艦）

### UI
- Home / Library / Notes / About / Contact（静的）
- Developers（Developer Portal）

### 必要 Backend
- Platform API（auth / key / scope / token / metering）
- Platform Schema（developer_keys / entitlements / tokens / meter）

### 実装済み
- Platform API（auth / keys / scopes / tokens / metering）

---

## 2. Epoch

### UI
- Timeline / Record Composer / Attachments / Visibility
- Browse / Org directory / Scout / Profile / Settings

### 必要 Backend
- Record APIs（/records）
- Billing session APIs（/billing/session）
- Attachment store
- Scout / Org / Profile / Settings の各API

### 未実装
- Scout / Org / Profile / Settings / Status の API
- 一部 UI が mock データのまま

---

## 3. Sigil

### UI
- Landing / Explore / Reader
- Spaces / Chapters / Edit / Adopted / Analytics / Settings

### 必要 Backend
- Sigil API（spaces / chapters / adoption / issue / verify）
- Sigil Schema（spaces, revisions, chapters, adoptions）

### 実装済み
- Sigil API（spaces / chapters / revisions / explore / reader / adoptions / issue / verify / analytics）
- Sigil DB（spaces / revisions / chapters / adoptions / artifacts）

---

## 4. Pact

### UI
- Employees / Ledger / Thresholds / Transitions / Reports / Settings / My

### 必要 Backend
- Pact API（employees / ledger / thresholds / transitions / reports）
- Pact Schema（ledger_entries, thresholds, transitions, reports）

### 実装済み
- Pact API（employees / thresholds / ledger / transitions / reports / my）
- Pact DB（employees / thresholds / ledger_entries / transitions / reports）

---

## 5. Talisman

### UI
- Credentials / Events / Settings / Billing / Integration

### 必要 Backend
- Talisman API（persons / credentials / signal / events）
- Talisman DB（credentials / events）

### 実装済み
- Talisman API（persons / credentials / signal / events）
- Talisman DB（persons / credentials / events）

---

## 6. Spell

### UI
- Spells / Scopes / Entitlements / Audit / Integration / Settings

### 必要 Backend
- Spell API（check / spells / scopes / entitlements / audit / reconcile / webhook）
- Spell Schema（spells / scopes / entitlements / audit / meter）

### 実装済み
- Spell API（check / spells / scopes / entitlements / audit / reconcile / webhook）
- Spell DB（spells / scopes / entitlements / audit / meter / stripe ledger）

---

## 7. 実装順（安全寄り）

1. Epoch UI 接続（scout / org / profile）
