# Spell Schema 仕様
Version 1.0  
Status: Final / Implementation-Complete Spec

---

## 1. Core

### spells
- spell_id (UUIDv7)
- name
- sku
- status (active | inactive)
- stripe_product_id
- stripe_price_id
- type (one_time | subscription)
- created_at

### scopes
- scope_key
- description
- created_at

### spell_scopes
- spell_id
- scope_key

---

## 2. Entitlements

### entitlements
- entitlement_id (UUIDv7)
- spell_id
- user_identifier
- status (active | revoked)
- granted_at
- revoked_at (nullable)
- source_event_id (stripe_event_id)

---

## 3. Audit / Metering

### scope_check_events
- check_id (UUIDv7)
- spell_id
- runtime_id
- user_identifier
- requested_scope
- allowed (bool)
- checked_at

### audit_logs
- audit_id (UUIDv7)
- event_name
- actor_id (nullable)
- target_id (nullable)
- metadata (JSON)
- created_at

### stripe_event_ledger
- stripe_event_id
- payload_hash
- received_at
- processed_at

---

## 4. Invariants

- Entitlement の更新は revoke で表現（削除禁止）
- scope_check_events は課金の唯一のメーター
- spell と scope は分離
