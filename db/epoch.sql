-- Epoch schema (records, profiles, orgs, scouts, settings)

CREATE TABLE epoch_profiles (
  user_id TEXT PRIMARY KEY,
  display_name TEXT,
  bio TEXT,
  avatar_url TEXT,
  profession TEXT,
  region TEXT,
  scout_visible BOOLEAN NOT NULL DEFAULT true,
  directory_visible BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE epoch_profile_links (
  link_id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES epoch_profiles(user_id) ON DELETE CASCADE,
  link_type TEXT NOT NULL,
  url TEXT NOT NULL,
  label TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE epoch_records (
  record_id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES epoch_profiles(user_id) ON DELETE CASCADE,
  recorded_at TIMESTAMPTZ NOT NULL,
  record_type TEXT NOT NULL,
  payload JSONB NOT NULL,
  prev_hash TEXT,
  record_hash TEXT NOT NULL UNIQUE,
  visibility TEXT NOT NULL CHECK (visibility IN ('private', 'scout_visible', 'public'))
);

CREATE INDEX epoch_records_user_time_idx
  ON epoch_records(user_id, recorded_at);

CREATE TABLE epoch_attachments (
  attachment_id TEXT PRIMARY KEY,
  record_id TEXT NOT NULL REFERENCES epoch_records(record_id) ON DELETE RESTRICT,
  attachment_hash TEXT NOT NULL,
  storage_pointer TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE read_grants (
  grant_id TEXT PRIMARY KEY,
  viewer_user_id TEXT NOT NULL REFERENCES epoch_profiles(user_id) ON DELETE CASCADE,
  target_user_id TEXT NOT NULL REFERENCES epoch_profiles(user_id) ON DELETE CASCADE,
  grant_type TEXT NOT NULL CHECK (grant_type IN ('time_window', 'read_session')),
  window_start TIMESTAMPTZ,
  window_end TIMESTAMPTZ,
  starts_at TIMESTAMPTZ,
  ends_at TIMESTAMPTZ,
  ended_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CHECK (
    (grant_type = 'time_window'
      AND window_start IS NOT NULL
      AND window_end IS NOT NULL
      AND starts_at IS NULL
      AND ends_at IS NULL)
    OR
    (grant_type = 'read_session'
      AND starts_at IS NOT NULL
      AND ends_at IS NOT NULL
      AND window_start IS NULL
      AND window_end IS NULL)
  ),
  CHECK (
    window_start IS NULL
    OR window_end IS NULL
    OR window_end > window_start
  ),
  CHECK (
    starts_at IS NULL
    OR ends_at IS NULL
    OR ends_at > starts_at
  )
);

CREATE INDEX read_grants_viewer_target_idx
  ON read_grants(viewer_user_id, target_user_id, created_at DESC);

CREATE INDEX read_grants_active_idx
  ON read_grants(viewer_user_id, target_user_id, ended_at);

CREATE TABLE audit_logs (
  audit_id TEXT PRIMARY KEY,
  event_name TEXT NOT NULL,
  actor_user_id TEXT,
  target_user_id TEXT,
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX audit_logs_actor_idx
  ON audit_logs(actor_user_id, created_at DESC);

CREATE INDEX audit_logs_target_idx
  ON audit_logs(target_user_id, created_at DESC);

CREATE TABLE epoch_orgs (
  org_id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  owner_user_id TEXT NOT NULL REFERENCES epoch_profiles(user_id) ON DELETE CASCADE,
  industry TEXT,
  location TEXT,
  founded_at DATE,
  description TEXT,
  is_public BOOLEAN NOT NULL DEFAULT false,
  allow_member_epoch_access BOOLEAN NOT NULL DEFAULT false,
  require_approval_for_join BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX epoch_orgs_owner_idx
  ON epoch_orgs(owner_user_id, created_at DESC);

CREATE TABLE epoch_org_departments (
  department_id TEXT PRIMARY KEY,
  org_id TEXT NOT NULL REFERENCES epoch_orgs(org_id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  parent_id TEXT REFERENCES epoch_org_departments(department_id) ON DELETE SET NULL,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX epoch_org_departments_org_idx
  ON epoch_org_departments(org_id, sort_order);

CREATE TABLE epoch_org_members (
  membership_id TEXT PRIMARY KEY,
  org_id TEXT NOT NULL REFERENCES epoch_orgs(org_id) ON DELETE CASCADE,
  user_id TEXT NOT NULL REFERENCES epoch_profiles(user_id) ON DELETE CASCADE,
  role TEXT,
  department TEXT,
  joined_at DATE,
  is_public BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (org_id, user_id)
);

CREATE INDEX epoch_org_members_org_idx
  ON epoch_org_members(org_id, created_at DESC);

CREATE INDEX epoch_org_members_user_idx
  ON epoch_org_members(user_id, created_at DESC);

CREATE TABLE epoch_scouts (
  scout_id TEXT PRIMARY KEY,
  initiator_user_id TEXT NOT NULL REFERENCES epoch_profiles(user_id) ON DELETE CASCADE,
  target_user_id TEXT NOT NULL REFERENCES epoch_profiles(user_id) ON DELETE CASCADE,
  status TEXT NOT NULL CHECK (status IN (
    'pending',
    'accepted',
    'declined',
    'in_discussion',
    'completed',
    'withdrawn'
  )),
  initiator_org_name TEXT,
  initiator_role TEXT,
  project_summary TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  responded_at TIMESTAMPTZ,
  accepted_at TIMESTAMPTZ,
  declined_at TIMESTAMPTZ,
  withdrawn_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ
);

CREATE INDEX epoch_scouts_initiator_idx
  ON epoch_scouts(initiator_user_id, created_at DESC);

CREATE INDEX epoch_scouts_target_idx
  ON epoch_scouts(target_user_id, created_at DESC);

CREATE TABLE epoch_scout_messages (
  message_id TEXT PRIMARY KEY,
  scout_id TEXT NOT NULL REFERENCES epoch_scouts(scout_id) ON DELETE CASCADE,
  sender_user_id TEXT,
  content TEXT NOT NULL,
  is_system BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX epoch_scout_messages_scout_idx
  ON epoch_scout_messages(scout_id, created_at ASC);

CREATE TABLE epoch_scout_settings (
  user_id TEXT PRIMARY KEY REFERENCES epoch_profiles(user_id) ON DELETE CASCADE,
  enabled BOOLEAN NOT NULL DEFAULT true,
  max_per_month INTEGER NOT NULL DEFAULT 10,
  selected_industries JSONB NOT NULL DEFAULT '[]'::jsonb,
  min_company_size INTEGER NOT NULL DEFAULT 0,
  exclude_keywords JSONB NOT NULL DEFAULT '[]'::jsonb,
  require_job_description BOOLEAN NOT NULL DEFAULT true,
  require_salary_range BOOLEAN NOT NULL DEFAULT false,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE epoch_silence_settings (
  user_id TEXT PRIMARY KEY REFERENCES epoch_profiles(user_id) ON DELETE CASCADE,
  days INTEGER NOT NULL DEFAULT 7,
  auto_generate BOOLEAN NOT NULL DEFAULT true,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
