-- Spell schema (spells, scopes, entitlements, audit, meter)

CREATE TABLE spells (
  spell_id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  sku TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('active', 'inactive')),
  stripe_product_id TEXT,
  stripe_price_id TEXT,
  type TEXT NOT NULL CHECK (type IN ('one_time', 'subscription')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE scopes (
  scope_key TEXT PRIMARY KEY,
  description TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE spell_scopes (
  spell_id TEXT NOT NULL REFERENCES spells(spell_id) ON DELETE CASCADE,
  scope_key TEXT NOT NULL REFERENCES scopes(scope_key) ON DELETE CASCADE,
  PRIMARY KEY (spell_id, scope_key)
);

CREATE TABLE entitlements (
  entitlement_id TEXT PRIMARY KEY,
  spell_id TEXT NOT NULL REFERENCES spells(spell_id) ON DELETE CASCADE,
  user_identifier TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('active', 'revoked')),
  granted_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  revoked_at TIMESTAMPTZ,
  source_event_id TEXT,
  UNIQUE (spell_id, user_identifier)
);

CREATE TABLE scope_check_events (
  check_id TEXT PRIMARY KEY,
  spell_id TEXT NOT NULL REFERENCES spells(spell_id) ON DELETE CASCADE,
  runtime_id TEXT NOT NULL,
  user_identifier TEXT NOT NULL,
  requested_scope TEXT NOT NULL,
  allowed BOOLEAN NOT NULL,
  checked_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE audit_logs (
  audit_id TEXT PRIMARY KEY,
  event_name TEXT NOT NULL,
  actor_id TEXT,
  target_id TEXT,
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE stripe_event_ledger (
  stripe_event_id TEXT PRIMARY KEY,
  payload_hash TEXT NOT NULL,
  received_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  processed_at TIMESTAMPTZ
);

CREATE INDEX entitlements_spell_idx
  ON entitlements(spell_id, status);

CREATE INDEX scope_check_events_spell_idx
  ON scope_check_events(spell_id, checked_at DESC);

CREATE INDEX audit_logs_event_idx
  ON audit_logs(event_name, created_at DESC);
