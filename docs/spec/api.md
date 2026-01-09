# API Spec

Required fields. Do not proceed if any REQUIRED placeholders remain.

## Public Endpoints
- GET /, /plans, /dashboard, /admin/pricing

## Auth/Identity Assumptions
- userId は認証基盤から取得し、API には userId が渡される前提。

## Billing Endpoints
- POST /api/billing/checkout: planKey -> Checkout URL
- POST /api/billing/portal: stripeCustomerId -> Portal URL
- POST /api/stripe/webhook: Stripe Webhook events
- POST /api/admin/pricing: create new Stripe Price and set active

## Error Handling
- 欠損入力は 400、未知の planKey は 404、価格未設定は 409、Webhook検証失敗は 400。
