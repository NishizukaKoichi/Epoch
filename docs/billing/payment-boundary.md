# Payment Boundary Definition

必須項目: 以下の REQUIRED プレースホルダを埋めること。
未記入のまま次工程へ進まない。

## free_cannot_do
自分のユーザーに対して「支払い完了→権限付与→利用開始」までを自動で通せない。
（無料状態で「できないこと」＝不確実性が残ること）

## payment_trigger
有料検証を今すぐ始める必要があり、決済/権限/計測の実装工数を削減できると納得した時。
（ユーザーが支払いを決断するトリガー：恐怖訴求ではなく合理）

## plan_key_1
starter
（プラン識別子1：例 basic / pro など）

## plan_1_entitlements
core_workflow, projects:3
（plan_key_1 で付与される entitlement scope 一覧）

## plan_key_2
pro
（プラン識別子2）

## plan_2_entitlements
core_workflow, priority_workflow, projects:50
（plan_key_2 で付与される entitlement scope 一覧）

## Notes
- 料金表は書かない。価格は seller が /admin/pricing で後から決める。
- 価格変更は「新しい Stripe Price を作成して Active を切替」のみ許可。
