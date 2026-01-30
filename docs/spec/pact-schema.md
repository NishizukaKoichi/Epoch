# Pact Schema 仕様
Version 1.0  
Status: Final / Implementation-Complete Spec

---

## 1. Core

### employees
- employee_id (UUIDv7)
- user_id (nullable)
- role_id
- status (active | exit)
- hired_at
- exited_at (nullable)
- created_at

### roles
- role_id (UUIDv7)
- name
- description
- created_at

### thresholds
- threshold_id (UUIDv7)
- role_id
- period_days
- min_threshold
- warning_threshold
- critical_threshold
- growth_threshold
- effective_at
- ended_at (nullable)
- created_at

---

## 2. Ledger / Transition

### ledger_entries
- entry_id (UUIDv7)
- employee_id
- metric_key
- metric_value
- metric_unit (nullable)
- period_start
- period_end
- recorded_at
- source (system | import | api)

### transitions
- transition_id (UUIDv7)
- employee_id
- from_state (growth | stable | warning | critical | exit)
- to_state (growth | stable | warning | critical | exit)
- window_start
- window_end
- triggered_at
- rule_ref (threshold_id)

---

## 3. Reports

### pact_reports
- report_id (UUIDv7)
- employee_id
- period_start
- period_end
- content_json
- created_at
- delivered_at (nullable)

---

## 4. Invariants

- Ledger は append-only
- 閾値の変更は ended_at で閉じ、新規作成する
- 手動遷移は不可
