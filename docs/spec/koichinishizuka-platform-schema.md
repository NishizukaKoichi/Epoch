# koichinishizuka.com Platform Schema 仕様
Version 1.0  
Status: Final / Implementation-Complete Spec

---

## 1. Developer Keys

### developer_keys
- key_id (UUIDv7)
- secret_hash
- owner_user_id
- name
- status (active | revoked)
- created_at
- revoked_at (nullable)
- last_used_at (nullable)

### developer_key_scopes
- key_id
- scope
- status (granted | revoked)
- granted_at
- revoked_at (nullable)
- condition_type (free | metered | review)
- condition_ref (nullable)

---

## 2. Entitlements

### entitlements
- entitlement_id (UUIDv7)
- subject_type (developer_key)
- subject_id
- scope
- status (active | revoked)
- granted_at
- revoked_at (nullable)
- reason (nullable)

---

## 3. Tokens

### access_tokens
- token_id (UUIDv7)
- key_id
- scopes (array)
- issued_at
- expires_at
- revoked_at (nullable)
- token_hash

### refresh_tokens
- token_id (UUIDv7)
- key_id
- issued_at
- expires_at
- revoked_at (nullable)
- token_hash

---

## 4. Metering / Audit

### meter_events
- event_id (UUIDv7)
- key_id
- scope
- request_id
- counted_at
- status (counted | ignored)

### audit_logs
- audit_id (UUIDv7)
- event_name
- actor_user_id (nullable)
- target_id (nullable)
- metadata (JSON)
- created_at

---

## 5. Invariants

- Token は hash のみ保存（平文保存禁止）
- Entitlement が唯一の真実点
- Scope 剥奪は revoke で表現（削除禁止）
