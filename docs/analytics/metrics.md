# Metrics Definition

必須項目: 以下の REQUIRED プレースホルダを埋めること。
未記入のまま次工程へ進まない。

## north_star
Checkout完了後に entitlement_granted が発生し、ユーザーがダッシュボードに到達すること。
（北極星指標：価値が成立していると判断できる "行動"）

## checkout_started
/api/billing/checkout のPOSTが成功し、track("checkout_started") を記録した時。
（Checkout開始の定義：どのイベント/ログをもって開始とするか）

## checkout_completed
Stripe webhookで checkout.session.completed を検証し、track("checkout_completed") を記録した時。
（完了の定義：真実点は webhook 側である前提）

## entitlement_granted
entitlements に status=active で保存され、track("entitlement_granted") を記録した時。
（付与の定義：どのテーブル/ログで確認できるか）

## payment_failed
Stripe webhookで invoice.payment_failed を受信し、track("payment_failed") を記録した時。
（失敗の定義：どのイベントで何が起きた扱いになるか）

## entitlement_revoked
Stripe webhookで customer.subscription.deleted を受信し、entitlements を revoked に更新して track("entitlement_revoked") を記録した時。
（剥奪の定義：どのイベント/操作が根拠になるか）
