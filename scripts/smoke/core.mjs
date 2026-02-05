#!/usr/bin/env node
import process from "node:process";
import { randomUUID } from "node:crypto";

const baseUrl =
  process.env.SMOKE_BASE_URL ?? process.env.APP_BASE_URL ?? "http://localhost:3000";

function fail(message, details) {
  console.error(`[smoke] FAIL: ${message}`);
  if (details !== undefined) {
    console.error(details);
  }
  process.exit(1);
}

async function requestJson(path, init = {}) {
  const response = await fetch(`${baseUrl}${path}`, init);
  let json = null;
  try {
    json = await response.json();
  } catch {
    json = null;
  }
  return { response, json };
}

function assert(condition, message, details) {
  if (!condition) {
    fail(message, details);
  }
}

async function run() {
  const userId = randomUUID();
  const recordContent = `smoke-${Date.now()}`;
  const spellId = randomUUID();

  console.log(`[smoke] baseUrl=${baseUrl}`);
  console.log(`[smoke] userId=${userId}`);

  const createRecord = await requestJson("/api/records", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      userId,
      recordType: "decision_made",
      payload: { content: recordContent },
      visibility: "private",
    }),
  });

  assert(createRecord.response.ok, "record creation failed", createRecord.json);
  const recordId = createRecord.json?.record?.recordId;
  assert(typeof recordId === "string" && recordId.length > 0, "record_id missing", createRecord.json);

  const listRecords = await requestJson(`/api/records/self?userId=${encodeURIComponent(userId)}`);
  assert(listRecords.response.ok, "record fetch failed", listRecords.json);
  const found = Array.isArray(listRecords.json?.records)
    ? listRecords.json.records.some((record) => record.recordId === recordId)
    : false;
  assert(found, "created record not found in self list", listRecords.json);

  const createKey = await requestJson("/api/v1/developer-keys", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-user-id": userId,
    },
    body: JSON.stringify({ name: `smoke-${Date.now()}` }),
  });
  assert(createKey.response.ok, "developer key creation failed", createKey.json);

  const keyId = createKey.json?.key?.key_id;
  const keySecret = createKey.json?.key?.key_secret;
  assert(typeof keyId === "string" && keyId.length > 0, "key_id missing", createKey.json);
  assert(typeof keySecret === "string" && keySecret.length > 0, "key_secret missing", createKey.json);

  const grantScope = await requestJson(`/api/v1/developer-keys/${keyId}/scopes`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-user-id": userId,
    },
    body: JSON.stringify({
      scope: "spell.check",
      action: "grant",
      conditionType: "free",
    }),
  });
  assert(grantScope.response.ok, "scope grant failed", grantScope.json);

  const issueTokens = await requestJson("/api/v1/tokens", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      authorization: `Bearer ${keySecret}`,
    },
    body: JSON.stringify({ scopes: ["spell.check"] }),
  });
  assert(issueTokens.response.ok, "token issue failed", issueTokens.json);

  const accessToken = issueTokens.json?.access_token;
  const refreshToken = issueTokens.json?.refresh_token;
  assert(typeof accessToken === "string" && accessToken.length > 0, "access_token missing", issueTokens.json);
  assert(typeof refreshToken === "string" && refreshToken.length > 0, "refresh_token missing", issueTokens.json);

  const refresh = await requestJson("/api/v1/tokens/refresh", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ refresh_token: refreshToken }),
  });
  assert(refresh.response.ok, "token refresh failed", refresh.json);

  const spellCheck = await requestJson("/api/v1/spell/check", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({
      spell_id: spellId,
      runtime_id: "smoke-runtime",
      user_identifier: userId,
      requested_scope: "spell.runtime.exec",
    }),
  });
  assert(spellCheck.response.ok, "spell check failed", spellCheck.json);
  assert(typeof spellCheck.json?.allowed === "boolean", "spell check response malformed", spellCheck.json);

  const revokeKey = await requestJson(`/api/v1/developer-keys/${keyId}/revoke`, {
    method: "POST",
    headers: { "x-user-id": userId },
  });
  assert(revokeKey.response.ok, "developer key revoke failed", revokeKey.json);

  console.log("[smoke] OK");
  console.log(`[smoke] record_id=${recordId}`);
  console.log(`[smoke] key_id=${keyId}`);
}

run().catch((error) => {
  fail("unexpected exception", error instanceof Error ? error.stack ?? error.message : error);
});
