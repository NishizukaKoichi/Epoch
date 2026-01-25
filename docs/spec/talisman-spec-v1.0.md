# **Talisman**

Online Identity Observation Infrastructure  
Version 1.0  
Status: Final / Implementation-Complete Spec

---

## 0. プロダクト定義

**Talisman** は、複数プロダクトを横断してオンライン人格に一意な `person_id` を付与し、その人格に紐づく **Credential（認証証拠）** と **Event（事実）** を集約し、**中立的な観測シグナル（score + flags）** を提供する API ファーストの基盤プロダクト。

Talisman 自身は、  
利用可否、制裁、結論、評価を一切決定しない。

Talisman が提供するのは、  
上位プロダクトが判断を行うために参照できる **観測結果のみ**。

判断・評価・選別・条件設定は、  
常に Talisman を利用する側のプロダクトの責務とする。

---

## 1. 提供価値

Talisman は、  
「複数のアカウントを **同一人物として扱っても構造が破綻しないか**」  
という一点において、共通の観測基盤を提供する。

各プロダクトが個別に同一人物性を実装すると、  
基準の不一致、統合不能、運用破綻が必ず発生する。

一方で、人物を評価・排除する中央集権的モデルは、  
倫理・法務・運用のいずれにおいても持続しない。

Talisman は、  
**同一人物性に関する観測点を集約し、その数を数値として返す**  
という最小機能に限定することで、  
評価や支配を行わずにこの問題を解消する。

---

## 2. 基本原則

・Talisman は常に中立  
・出力は **score（数値）** と **flags（状態）** のみ  
・判断・制裁・推奨・結論は行わない  
・入力には必ず登録主体（issuer）が紐づく  
・個人を直接特定できる生データは保持しない  
・一致判定は正規化済みハッシュのみで行う  
・誤登録は撤回可能、撤回後は再計算される

---

## 3. オンライン人格モデル

Talisman は、  
各プロダクトのユーザーアカウントを直接統合しない。

代わりに、  
オンライン人格を表す一意な識別子として `person_id` を発行し、  
各認証結果やアカウントをこの `person_id` に紐づける。

異なる認証方式で作成されたアカウントであっても、  
**同一人物に由来すると観測できる Credential が一致した場合**、  
同じ `person_id` に統合される。

認証方式の違いは、  
人物識別の一貫性に影響しない。

---

## 4. Credential（認証証拠）

Credential は、  
「この主体が同一人物であると観測できる独立した根拠」。

・複数種類を同時に保持可能  
・すべて **等価な独立観測点** として扱う  
・種類による強弱、序列、重み付けは行わない

Credential の追加は観測点の増加であり、  
撤回はその観測点の消失を意味する。

---

## 5. 同一人物性スコア

スコアは以下で定義される。

```
score = 有効な Credential の数
```

性質  
・評価ではない  
・信用を意味しない  
・善悪を示さない  
・単調増加（追加で上がる）  
・撤回で再計算される

スコアは  
**観測密度を示す指標** にすぎない。

---

## 6. 統合ログインとしての利用

Talisman は、  
**認証入口を一本化するための統合ログイン基盤**として利用できる。

上位プロダクトは、  
個別にログイン方式を実装する代わりに、  
Talisman を唯一の認証入口として利用できる。

### 認証手段の扱い

各プロダクトは以下を自由に選択できる。

・許可する認証手段を限定する  
・認証手段を `auto` に設定する  
・特定手段を必須にする  
・支払い系 Credential を条件に含める

`auto` の場合、  
ユーザーはどの認証手段を用いてもログイン可能となり、  
差分は **score と flags に自然に反映される**。

---

## 7. 条件付き利用制御（責務分離）

Talisman は条件を評価しない。

上位プロダクトは、  
返却された score / flags を用いて、

・ログイン可否  
・機能利用範囲  
・重要操作の制限

を自由に定義できる。

Talisman は  
**条件判断を行わず、判断材料のみを返す**。

---

## 8. 第三者判断の保持

第三者プロダクトが行った判断は、  
「解釈されない事実」として Event 化して保持できる。

それらは  
・強制力を持たない  
・優先順位を持たない  
・拘束力を持たない

参照するかどうか、どう使うかは  
常に利用側の選択に委ねられる。

---

## 9. 完成条件（v1）

以下を満たした時点で Talisman v1 は完成している。

・`person_id` が安定して発行・維持されている  
・複数認証方式が一人格に統合されている  
・score が Credential 数として算出されている  
・flags が一貫して返却されている  
・Talisman 自身が判断を行っていない

---

## 結び

Talisman は評価装置ではない。  
人物を裁かない。

複数の認証という **観測点** を束ね、  
人物単位の一意性を **数として示す** だけ。

意味づけは世界に委ねられる。  
Talisman は、ただ見えるようにする。

---

この版で、

・入口一本化  
・auto 認証  
・手段制限  
・スコア閾値運用  
・中立性

が **すべて仕様として閉じている**。

次にやるなら本当に  
「Client Config API（許可手段 / auto / policy hook）」  
だけを書けば、即実装に入れる段階にある。

---

# **Talisman 技術仕様書 v1.0**

Online Identity Observation Infrastructure  
Status: Final / Implementation-Ready

---

## 1. システム責務定義

### 1.1 Talisman が担う責務

・認証結果を **Credential** として正規化・登録  
・オンライン人格を表す `person_id` の発行・解決  
・Credential の追加・撤回管理  
・同一人物性スコア（観測点数）の算出  
・状態フラグ（flags）の提供  
・すべての状態変化を Event として保存

### 1.2 Talisman が担わない責務

・ログイン可否の判断  
・利用制限／BAN／制裁  
・信用・評価・優劣付け  
・行動ログ解析  
・セッション管理  
・アクセストークン発行

---

## 2. 全体アーキテクチャ

### 2.1 論理構成

```
[ Client / Product ]
        ↓
[ Talisman API Layer ]
        ↓
[ Core Resolution Layer ]
        ↓
[ Event Store + State View ]
```

### 2.2 レイヤ責務

#### API Layer

・外部プロダクトとの通信窓口  
・完全 stateless  
・JSON over HTTPS

#### Core Layer

・Credential 正規化  
・person_id 解決  
・score / flags 算出

#### Persistence Layer

・追記専用 Event Store  
・現在状態の Materialized View

---

## 3. ID 設計

### 3.1 person_id

```
person_id: UUIDv7
```

・オンライン人格単位で一意  
・再発行不可  
・削除不可

### 3.2 subject_id（任意）

・上位プロダクト側のユーザー ID  
・Talisman では opaque として保存  
・一意性や意味は解釈しない

---

## 4. Credential 設計

### 4.1 データモデル

```json
Credential {
  credential_id: "uuidv7",
  person_id: "uuidv7",
  type: "string",
  normalized_hash: "string",
  issuer: "string",
  issued_at: "timestamp",
  revoked_at: "timestamp | null"
}
```

### 4.2 type 一覧（v1）

・email_magiclink  
・phone_otp  
・oauth_google  
・oauth_apple  
・oauth_microsoft  
・oauth_x  
・passkey  
・payment_card

※ すべて等価  
※ 重み・強弱なし

### 4.3 正規化ルール

・生データは保存しない  
・一致判定は hash のみ

例：

```
email        → lowercase + trim → hash
phone        → E.164            → hash
oauth        → provider_user_id → hash
passkey      → credential_id   → hash
payment_card → network + last4 + fingerprint → hash
```

---

## 5. Event モデル（不可逆）

### 5.1 データ構造

```json
Event {
  event_id: "uuidv7",
  person_id: "uuidv7",
  event_type: "string",
  payload: {},
  actor: "system | product",
  recorded_at: "timestamp"
}
```

### 5.2 event_type

・person_created  
・credential_added  
・credential_revoked

---

## 6. person 解決ロジック

1. Credential を正規化
    
2. 同一 hash を持つ Credential を検索
    
3. 既存 person_id があれば紐づけ
    
4. なければ新規 person_id を発行
    

※ person のマージ／分割 API は存在しない

---

## 7. スコア計算

### 7.1 定義

```
score = count(
  Credential where revoked_at == null
)
```

・種類不問  
・順序不問  
・評価意味なし

### 7.2 再計算

・Event から常に再構築可能  
・Materialized View はキャッシュ扱い

---

## 8. flags 設計

### 8.1 定義

flags は **解釈を含まない存在状態**。

```json
flags {
  has_email: true,
  has_phone: false,
  has_oauth: true,
  has_payment: false,
  has_passkey: true
}
```

制約  
・boolean のみ  
・比較・合成ロジック禁止  
・評価語禁止

---

## 9. 認証フロー（統合ログイン）

### 9.1 基本フロー

1. クライアント → Talisman `/auth/start`
    
2. 認証成功（OAuth / Email / SMS / Passkey 等）
    
3. Credential 登録
    
4. person_id 解決
    
5. 観測結果返却
    

### 9.2 auto 認証

・認証手段を限定しない  
・ユーザーは任意の手段を選択  
・差分は score / flags に反映される

---

## 10. API 定義

### 10.1 person 作成

```http
POST /persons
```

```json
{
  "person_id": "uuidv7"
}
```

---

### 10.2 Credential 追加

```http
POST /credentials
```

```json
{
  "person_id": "uuidv7",
  "type": "email_magiclink",
  "raw_value": "user@example.com",
  "issuer": "talisman-auth"
}
```

---

### 10.3 Credential 撤回

```http
POST /credentials/revoke
```

```json
{
  "credential_id": "uuidv7",
  "actor": "product"
}
```

---

### 10.4 観測結果取得

```http
GET /persons/{person_id}/signal
```

```json
{
  "person_id": "uuidv7",
  "score": 3,
  "flags": {
    "has_email": true,
    "has_oauth": true,
    "has_payment": false
  }
}
```

---

## 11. Client（上位プロダクト）連携前提

・Talisman はセッションを持たない  
・token を発行しない  
・認可判断は上位プロダクトが行う

例：

```
if score >= 2 and has_payment:
    allow()
else:
    deny()
```

---

## 12. セキュリティ前提

・raw 認証情報は即破棄  
・hash salt は環境単位  
・issuer は必須  
・内部操作も Event 記録

---

## 13. v1 完成条件

・person_id が一貫して解決される  
・複数認証方式が統合される  
・score が Credential 数として返る  
・flags が正確に反映される  
・判断ロジックが存在しない

---

## 14. 固定仕様（今後も変えない）

・Credential に強弱を持たせない  
・score を信用指標にしない  
・Talisman 側で条件判断しない  
・行動データを入れない

---

### 最終補足

これは  
**認証基盤でも信用基盤でもない**。

「同一人物性を観測する装置」。

評価を入れた瞬間に壊れるので、  
壊れない最小構成だけを仕様として固定している。

---

次にやるとしたら  
・Client Config API（auto / 許可手段）  
・Policy Hook I/F  
を書くだけで、そのままプロダクト実装に入れる。
