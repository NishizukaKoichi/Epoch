# State Flow

Required fields. Do not proceed if any REQUIRED placeholders remain.

## States
- Anonymous: 未ログインでテンプレ内容を閲覧している状態。
- Onboarded: ログイン済みで初期設定（planKey選択など）を完了した状態。
- Considering payment: /plansで課金を検討し、Checkout開始前後の状態。
- Entitled: Webhookで checkout.session.completed を受け、entitlement が active の状態。
- Revoked: customer.subscription.deleted により entitlement が revoked の状態。

## Transitions
- Key transitions and triggers: Anonymous→Onboarded（サインアップ完了）、Onboarded→Considering payment（/plans閲覧・checkout開始）、Considering payment→Entitled（webhook完了）、Entitled→Revoked（subscription削除）、Revoked→Considering payment（再課金を開始）。
