# Schema Spec

Required fields. Do not proceed if any REQUIRED placeholders remain.

## Tables
- users
- billing_customers
- subscriptions
- product_plans
- product_plan_prices
- entitlements

## Notes
- Entitlements are the only execution gate.
- Stripe Price IDs are reference-only; logic must never branch on priceId.

## Required Changes for Your Product
- テンプレのまま使用。必要に応じて product_plans.cap に制限値（例: projects）を保存する。
