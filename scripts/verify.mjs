#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";

const checks = [
  { file: "docs/value.md", label: "Value" },
  { file: "docs/value-map.md", label: "Value Map" },
  { file: "docs/mvp.md", label: "MVP" },
  { file: "docs/flow/user-flow.md", label: "User Flow" },
  { file: "docs/flow/state.md", label: "State Flow" },
  { file: "docs/billing/payment-boundary.md", label: "Payment Boundary" },
  { file: "docs/analytics/metrics.md", label: "Metrics" },
  { file: "docs/insights/paid-users.md", label: "Paid Users Insights" },
  { file: "docs/spec/api.md", label: "API Spec" },
  { file: "docs/spec/schema.md", label: "Schema Spec" },
  { file: "docs/ops/assumptions.md", label: "Assumptions" },
  { file: "docs/ops/release.md", label: "Release" },
  { file: "docs/done.md", label: "Done" },
];

const requiredPattern = /__REQUIRED:([a-z0-9_-]+)__/gi;
const errors = [];

for (const check of checks) {
  const filePath = path.resolve(process.cwd(), check.file);
  if (!fs.existsSync(filePath)) {
    errors.push(`${check.file}: missing file`);
    continue;
  }

  const content = fs.readFileSync(filePath, "utf8");
  const matches = [...content.matchAll(requiredPattern)].map((match) => match[1]);
  if (matches.length > 0) {
    errors.push(`${check.file}: ${matches.join(", ")}`);
  }
}

if (errors.length > 0) {
  console.error("Missing required fields:");
  for (const error of errors) {
    console.error(`- ${error}`);
  }
  process.exit(1);
}

console.log("OK");
process.exit(0);
