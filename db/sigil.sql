-- Sigil schema (spaces, chapters, revisions, adoptions, artifacts)

CREATE TABLE spaces (
  space_id TEXT PRIMARY KEY,
  owner_user_id TEXT NOT NULL,
  visibility TEXT NOT NULL CHECK (visibility IN ('public', 'unlisted', 'private')),
  status TEXT NOT NULL CHECK (status IN ('draft', 'final', 'deprecated')),
  current_revision_id TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE space_revisions (
  revision_id TEXT PRIMARY KEY,
  space_id TEXT NOT NULL REFERENCES spaces(space_id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  purpose TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  author_user_id TEXT NOT NULL
);

CREATE TABLE chapters (
  chapter_id TEXT PRIMARY KEY,
  space_id TEXT NOT NULL REFERENCES spaces(space_id) ON DELETE CASCADE,
  order_index INTEGER NOT NULL,
  current_revision_id TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE chapter_revisions (
  revision_id TEXT PRIMARY KEY,
  chapter_id TEXT NOT NULL REFERENCES chapters(chapter_id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  author_user_id TEXT NOT NULL
);

CREATE TABLE adoptions (
  adoption_id TEXT PRIMARY KEY,
  space_id TEXT NOT NULL REFERENCES spaces(space_id) ON DELETE CASCADE,
  user_id TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('accepted', 'declined')),
  decided_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (space_id, user_id)
);

CREATE TABLE read_receipts (
  receipt_id TEXT PRIMARY KEY,
  space_id TEXT NOT NULL REFERENCES spaces(space_id) ON DELETE CASCADE,
  user_id TEXT NOT NULL,
  chapter_id TEXT,
  recorded_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE share_links (
  token TEXT PRIMARY KEY,
  space_id TEXT NOT NULL REFERENCES spaces(space_id) ON DELETE CASCADE,
  expires_at TIMESTAMPTZ,
  revoked_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE sigil_artifacts (
  artifact_id TEXT PRIMARY KEY,
  space_id TEXT NOT NULL REFERENCES spaces(space_id) ON DELETE CASCADE,
  revision_id TEXT NOT NULL,
  subject_user_id TEXT NOT NULL,
  signature TEXT NOT NULL,
  issued_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX spaces_owner_idx
  ON spaces(owner_user_id, created_at DESC);

CREATE INDEX chapters_space_idx
  ON chapters(space_id, order_index);

CREATE INDEX adoptions_space_idx
  ON adoptions(space_id, decided_at DESC);

CREATE INDEX sigil_artifacts_space_idx
  ON sigil_artifacts(space_id, issued_at DESC);
