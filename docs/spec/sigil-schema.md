# Sigil Schema 仕様
Version 1.0  
Status: Final / Implementation-Complete Spec

---

## 1. Core

### spaces
- space_id (UUIDv7)
- owner_user_id
- visibility (public | unlisted | private)
- status (draft | final | deprecated)
- current_revision_id
- created_at

### space_revisions
- revision_id (UUIDv7)
- space_id (FK → spaces)
- title
- purpose
- created_at
- author_user_id

### chapters
- chapter_id (UUIDv7)
- space_id (FK → spaces)
- order_index (int)
- current_revision_id
- created_at

### chapter_revisions
- revision_id (UUIDv7)
- chapter_id (FK → chapters)
- title
- body
- created_at
- author_user_id

---

## 2. Adoption / Reading

### adoptions
- adoption_id (UUIDv7)
- space_id
- user_id
- status (accepted | declined)
- decided_at
- created_at

### read_receipts
- receipt_id (UUIDv7)
- space_id
- user_id
- chapter_id (nullable)
- recorded_at

---

## 3. Sharing / Issue

### share_links
- token (opaque)
- space_id
- expires_at (nullable)
- revoked_at (nullable)
- created_at

### sigil_artifacts
- artifact_id (UUIDv7)
- space_id
- revision_id
- subject_user_id
- signature
- issued_at

---

## 4. Invariants

- 本文は revision 追記のみ（上書き禁止）
- DELETE は存在しない
- 公開可否は status と visibility で決まる
