# Release

Required fields. Do not proceed if any REQUIRED placeholders remain.

## Release Checklist
- Rollout plan: 内部検証→限定ベータ→一般公開の順で拡大。
- Monitoring plan: webhook失敗率、checkout_completed、entitlement_granted を監視。
- Rollback plan: /admin/pricing で Active を外し、影響範囲を停止。
- Owner: プロダクト責任者。
