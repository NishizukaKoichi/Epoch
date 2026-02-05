# Smoke Tests

## Command
- `pnpm smoke`

## What it validates
1. Epoch write/read path
- Create record via `POST /api/records`
- Read back via `GET /api/records/self`

2. Platform key/token path
- Create developer key
- Grant `spell.check` scope
- Issue access + refresh tokens
- Refresh access token

3. Spell execution gate path
- Call `POST /api/v1/spell/check`
- Verify response shape (`allowed` boolean)

4. Key revocation path
- Revoke developer key

## Environment
- Target URL is read from `SMOKE_BASE_URL` then `APP_BASE_URL`, fallback `http://localhost:3000`.
- App must be running before smoke starts.

## Failure behavior
- Any failed assertion exits with non-zero code.
- Error payload is printed for quick triage.
