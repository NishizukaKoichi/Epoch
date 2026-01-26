"use client"

import { useSyncExternalStore } from "react"

export type PactState = "growth" | "stable" | "warning" | "critical" | "exit"

// データ入力者の種別
export type DataSourceType =
  | "manual_admin" // 管理者が手動入力
  | "manual_self" // 本人が自己申告
  | "manual_manager" // 上長が入力
  | "system_integration" // システム連携（API等）
  | "third_party" // 第三者評価

export interface Employee {
  id: string
  name: string
  email: string
  role: string
  roleId: string
  department: string
  state: PactState
  hireDate: string
  lastEvaluated: string
}

export interface LedgerEntry {
  id: string
  employeeId: string
  employeeName: string
  metric: string
  value: number
  unit: string
  period: string
  sourceType: DataSourceType
  sourceName: string // 具体的なソース名（Jira, Salesforce, 上長名等）
  recordedBy: string
  recordedAt: string
  note?: string
}

export interface Transition {
  id: string
  employeeId: string
  employeeName: string
  fromState: PactState
  toState: PactState
  reason: string
  triggeredBy: string
  date: string
}

export interface MetricDefinition {
  id: string
  name: string
  unit: string
  description: string
  dataSourceType: DataSourceType
  dataSourceName: string
  weight: number
  thresholds: {
    growth: number
    stable: number
    warning: number
    critical: number
  }
  // 閾値の方向（higher_is_better: 数値が高いほど良い, lower_is_better: 数値が低いほど良い）
  direction: "higher_is_better" | "lower_is_better"
}

export interface RoleConfig {
  id: string
  roleName: string
  department: string
  description: string
  metrics: MetricDefinition[]
  evaluationPeriodDays: number
}

export interface Report {
  id: string
  type: "salary_adjustment" | "role_continuation" | "pact_report"
  employeeId: string
  employeeName: string
  state: PactState
  generatedAt: string
  status: "draft" | "finalized" | "delivered"
}

interface PactStoreState {
  employees: Employee[]
  ledgerEntries: LedgerEntry[]
  transitions: Transition[]
  roleConfigs: RoleConfig[]
  reports: Report[]
}

interface PactStoreActions {
  addEmployee: (employee: Omit<Employee, "id" | "state" | "lastEvaluated">) => void
  updateEmployee: (id: string, updates: Partial<Employee>) => void
  deleteEmployee: (id: string) => void
  addLedgerEntry: (entry: Omit<LedgerEntry, "id" | "recordedAt">) => void
  updateLedgerEntry: (id: string, updates: Partial<LedgerEntry>) => void
  deleteLedgerEntry: (id: string) => void
  addTransition: (transition: Omit<Transition, "id">) => void
  addRoleConfig: (config: Omit<RoleConfig, "id">) => void
  updateRoleConfig: (id: string, updates: Partial<RoleConfig>) => void
  deleteRoleConfig: (id: string) => void
  addReport: (report: Omit<Report, "id">) => void
  updateReport: (id: string, updates: Partial<Report>) => void
  deleteReport: (id: string) => void
}

export type PactStore = PactStoreState & PactStoreActions

const initialState: PactStoreState = {
  employees: [],
  ledgerEntries: [],
  transitions: [],
  roleConfigs: [],
  reports: [],
}

let state: PactStoreState = initialState
const listeners = new Set<() => void>()

function emitChange() {
  listeners.forEach((listener) => listener())
}

function setState(updater: (current: PactStoreState) => PactStoreState) {
  state = updater(state)
  emitChange()
}

const actions: PactStoreActions = {
  addEmployee: (employee) =>
    setState((current) => ({
      ...current,
      employees: [
        ...current.employees,
        {
          ...employee,
          id: `emp-${Date.now()}`,
          state: "stable",
          lastEvaluated: new Date().toISOString().split("T")[0],
        },
      ],
    })),
  updateEmployee: (id, updates) =>
    setState((current) => ({
      ...current,
      employees: current.employees.map((employee) =>
        employee.id === id ? { ...employee, ...updates } : employee,
      ),
    })),
  deleteEmployee: (id) =>
    setState((current) => ({
      ...current,
      employees: current.employees.filter((employee) => employee.id !== id),
    })),
  addLedgerEntry: (entry) =>
    setState((current) => ({
      ...current,
      ledgerEntries: [
        {
          ...entry,
          id: `ledger-${Date.now()}`,
          recordedAt: new Date().toISOString().split("T")[0],
        },
        ...current.ledgerEntries,
      ],
    })),
  updateLedgerEntry: (id, updates) =>
    setState((current) => ({
      ...current,
      ledgerEntries: current.ledgerEntries.map((entry) =>
        entry.id === id ? { ...entry, ...updates } : entry,
      ),
    })),
  deleteLedgerEntry: (id) =>
    setState((current) => ({
      ...current,
      ledgerEntries: current.ledgerEntries.filter((entry) => entry.id !== id),
    })),
  addTransition: (transition) =>
    setState((current) => ({
      ...current,
      transitions: [
        { ...transition, id: `trans-${Date.now()}` },
        ...current.transitions,
      ],
    })),
  addRoleConfig: (config) =>
    setState((current) => ({
      ...current,
      roleConfigs: [
        ...current.roleConfigs,
        { ...config, id: `role-${Date.now()}` },
      ],
    })),
  updateRoleConfig: (id, updates) =>
    setState((current) => ({
      ...current,
      roleConfigs: current.roleConfigs.map((role) =>
        role.id === id ? { ...role, ...updates } : role,
      ),
    })),
  deleteRoleConfig: (id) =>
    setState((current) => ({
      ...current,
      roleConfigs: current.roleConfigs.filter((role) => role.id !== id),
    })),
  addReport: (report) =>
    setState((current) => ({
      ...current,
      reports: [{ ...report, id: `report-${Date.now()}` }, ...current.reports],
    })),
  updateReport: (id, updates) =>
    setState((current) => ({
      ...current,
      reports: current.reports.map((report) =>
        report.id === id ? { ...report, ...updates } : report,
      ),
    })),
  deleteReport: (id) =>
    setState((current) => ({
      ...current,
      reports: current.reports.filter((report) => report.id !== id),
    })),
}

function subscribe(listener: () => void) {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

function getSnapshot() {
  return state
}

export function usePactStore(): PactStore {
  const snapshot = useSyncExternalStore(subscribe, getSnapshot, getSnapshot)
  return {
    ...snapshot,
    ...actions,
  }
}

// Data source type labels
export const dataSourceLabels: Record<DataSourceType, string> = {
  manual_admin: "管理者入力",
  manual_self: "本人申告",
  manual_manager: "上長入力",
  system_integration: "システム連携",
  third_party: "第三者評価",
}
