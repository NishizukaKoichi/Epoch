# Value Map

Required fields. Do not proceed if any REQUIRED placeholders remain.

## Value Chain
- Trigger: 仕様が固まり、有料検証を急いで開始したい。
- Action: テンプレ導入→planKey設定→Checkout/Webhook動作確認。
- Outcome: 有料検証を数日以内に開始できる。

## Value to Metrics
- Value statement: 課金/権限/計測の雛形で仕様から有料検証までの時間を短縮する。
- Leading metric: 週次の checkout_started 件数。
- Lagging metric: checkout_completed と entitlement_granted の完了率。
