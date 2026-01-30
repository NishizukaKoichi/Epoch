-- Talisman schema (persons, credentials, events)

CREATE TABLE persons (
  person_id TEXT PRIMARY KEY,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE credentials (
  credential_id TEXT PRIMARY KEY,
  person_id TEXT NOT NULL REFERENCES persons(person_id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  normalized_hash TEXT NOT NULL,
  issuer TEXT NOT NULL,
  issued_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  revoked_at TIMESTAMPTZ,
  UNIQUE (type, normalized_hash)
);

CREATE TABLE events (
  event_id TEXT PRIMARY KEY,
  person_id TEXT NOT NULL REFERENCES persons(person_id) ON DELETE CASCADE,
  event_type TEXT NOT NULL,
  payload JSONB NOT NULL DEFAULT '{}'::jsonb,
  actor TEXT NOT NULL,
  recorded_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE talisman_subscriptions (
  person_id TEXT PRIMARY KEY REFERENCES persons(person_id) ON DELETE CASCADE,
  plan_id TEXT NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX credentials_person_idx
  ON credentials(person_id, issued_at DESC);

CREATE INDEX events_person_idx
  ON events(person_id, recorded_at DESC);

CREATE INDEX talisman_subscriptions_plan_idx
  ON talisman_subscriptions(plan_id, updated_at DESC);
