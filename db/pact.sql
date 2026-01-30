-- Pact schema (employees, thresholds, ledger, transitions, reports)

CREATE TABLE roles (
  role_id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE employees (
  employee_id TEXT PRIMARY KEY,
  user_id TEXT,
  role_id TEXT NOT NULL REFERENCES roles(role_id),
  status TEXT NOT NULL CHECK (status IN ('active', 'exit')),
  hired_at DATE NOT NULL,
  exited_at DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  display_name TEXT NOT NULL
);

CREATE TABLE thresholds (
  threshold_id TEXT PRIMARY KEY,
  role_id TEXT NOT NULL REFERENCES roles(role_id),
  period_days INTEGER NOT NULL,
  min_threshold DOUBLE PRECISION NOT NULL,
  warning_threshold DOUBLE PRECISION NOT NULL,
  critical_threshold DOUBLE PRECISION NOT NULL,
  growth_threshold DOUBLE PRECISION NOT NULL,
  effective_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  ended_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE ledger_entries (
  entry_id TEXT PRIMARY KEY,
  employee_id TEXT NOT NULL REFERENCES employees(employee_id),
  metric_key TEXT NOT NULL,
  metric_value DOUBLE PRECISION NOT NULL,
  metric_unit TEXT,
  period_start DATE NOT NULL,
  period_end DATE NOT NULL,
  recorded_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  source TEXT NOT NULL CHECK (source IN ('system', 'import', 'api'))
);

CREATE TABLE transitions (
  transition_id TEXT PRIMARY KEY,
  employee_id TEXT NOT NULL REFERENCES employees(employee_id),
  from_state TEXT NOT NULL CHECK (from_state IN ('growth', 'stable', 'warning', 'critical', 'exit')),
  to_state TEXT NOT NULL CHECK (to_state IN ('growth', 'stable', 'warning', 'critical', 'exit')),
  window_start DATE NOT NULL,
  window_end DATE NOT NULL,
  triggered_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  rule_ref TEXT NOT NULL REFERENCES thresholds(threshold_id)
);

CREATE TABLE pact_reports (
  report_id TEXT PRIMARY KEY,
  employee_id TEXT NOT NULL REFERENCES employees(employee_id),
  period_start DATE NOT NULL,
  period_end DATE NOT NULL,
  content_json JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  delivered_at TIMESTAMPTZ
);

CREATE INDEX employees_role_idx
  ON employees(role_id, created_at DESC);

CREATE INDEX ledger_entries_employee_idx
  ON ledger_entries(employee_id, recorded_at DESC);

CREATE INDEX transitions_employee_idx
  ON transitions(employee_id, triggered_at DESC);

CREATE INDEX thresholds_role_idx
  ON thresholds(role_id, effective_at DESC);
