# Payment Boundary Definition

必須項目: 以下の __REQUIRED:...__ を埋めること。
未記入のまま次工程へ進まない。

## free_cannot_do
__REQUIRED:free_cannot_do__
（無料状態で「できないこと」＝不確実性が残ること）

## payment_trigger
__REQUIRED:payment_trigger__
（ユーザーが支払いを決断するトリガー：恐怖訴求ではなく合理）

## plan_key_1
__REQUIRED:plan_key_1__
（プラン識別子1：例 basic / pro など）

## plan_1_entitlements
__REQUIRED:plan_1_entitlements__
（plan_key_1 で付与される entitlement scope 一覧）

## plan_key_2
__REQUIRED:plan_key_2__
（プラン識別子2）

## plan_2_entitlements
__REQUIRED:plan_2_entitlements__
（plan_key_2 で付与される entitlement scope 一覧）

## Notes
- 料金表は書かない。価格は seller が /admin/pricing で後から決める。
- 価格変更は「新しい Stripe Price を作成して Active を切替」のみ許可。
