# Metrics Definition

必須項目: 以下の __REQUIRED:...__ を埋めること。
未記入のまま次工程へ進まない。

## north_star
__REQUIRED:north_star__
（北極星指標：価値が成立していると判断できる "行動"）

## checkout_started
__REQUIRED:checkout_started__
（Checkout開始の定義：どのイベント/ログをもって開始とするか）

## checkout_completed
__REQUIRED:checkout_completed__
（完了の定義：真実点は webhook 側である前提）

## entitlement_granted
__REQUIRED:entitlement_granted__
（付与の定義：どのテーブル/ログで確認できるか）

## payment_failed
__REQUIRED:payment_failed__
（失敗の定義：どのイベントで何が起きた扱いになるか）

## entitlement_revoked
__REQUIRED:entitlement_revoked__
（剥奪の定義：どのイベント/操作が根拠になるか）
