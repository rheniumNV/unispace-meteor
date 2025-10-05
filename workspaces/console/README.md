# @unispace-meteor/console

Resonite統合用のExpressサーバー

隕石衝突シミュレーション結果をResonite内でインタラクティブに可視化するためのバックエンドサーバーです。MirageXを使用してWeb技術でResonite内のオブジェクト・UIを構築します。

## 主要機能

- **WebSocket通信**: リアルタイムでシミュレーション結果をResoniteに配信
- **MirageX統合**: React ReconcilerでResonite内オブジェクトを宣言的に構築
- **RESTful API**: シミュレーション実行・データ取得のためのエンドポイント
- **Resonite認証**: Resonite Cloudとの連携・認証処理

## アーキテクチャ

```
console/
├── src/
│   ├── server/      # Expressサーバー本体
│   ├── res/         # Resoniteオブジェクト生成（MirageX）
│   ├── core/        # アプリケーションロジック
│   ├── lib/         # ライブラリ・ユーティリティ
│   └── dev/         # 開発用ツール
├── tsconfig.main.json    # サーバー用TypeScript設定
└── tsconfig.res.json     # Resonite用TypeScript設定
```

## インストール

モノレポのルートから:

```bash
npm install
```

## セットアップ

### 環境変数

`.env` ファイルをプロジェクトルートに作成:

```env
# Resonite認証
RESONITE_USERNAME=your_username
RESONITE_PASSWORD=your_password

# MirageXサーバー設定
MIRAGE_URL=http://localhost
MIRAGE_PORT=3000
MIRAGE_SERVER_ID=your_server_id

# その他の設定
PORT=8080
```

## 使い方

### 開発モード

```bash
# ルートから
npm run dev:console

# または console ディレクトリ内で
npm run dev
```

これにより以下が起動します:
- `dev:res`: Resoniteオブジェクト生成コードのwatch & 実行
- `dev:server`: Expressサーバーのwatch & 再起動

### ビルド

```bash
# ルートから
npm run build:console

# または console ディレクトリ内で
npm run build
```

ビルド成果物は `dist/` ディレクトリに出力されます。

### 本番実行

```bash
npm start
```

## API エンドポイント

### ヘルスチェック

```
GET /ping
```

レスポンス: `"pong"`

### その他のエンドポイント

詳細は `src/server/index.ts` を参照してください。

## MirageX統合

このモジュールは `@unispace-meteor/miragex` を使用してResonite内にオブジェクトを描画します。

### 仕組み

1. **Reactコンポーネント作成** (`src/core/main.tsx`):
   ```tsx
   export const App = () => {
     return (
       <slot name="Root">
         <text content="Hello Resonite!" />
       </slot>
     );
   };
   ```

2. **MirageXサーバー起動** (`src/server/index.ts`):
   ```typescript
   const mirageXServer = new MirageXServer(mirageXConfig);
   mirageXServer.start();
   ```

3. **Resoniteフレーム生成** (`src/res/index.ts`):
   - Reactコンポーネントを元にResoniteオブジェクトを生成
   - Brson形式でエクスポート
   - Resonite内にインポート

### カスタマイズ

`src/core/main.tsx` を編集してResonite内のUI/オブジェクトをカスタマイズできます。

## 開発

### テスト

```bash
npm test
```

### Lint / Format

```bash
npm run lint        # Lint チェック
npm run lint:fix    # Lint 自動修正
npm run format      # Format
```

### クリーンアップ

```bash
npm run clean
```

## 開発用ツール

### ユニットパッケージ同期

```bash
npm run unitPackage:sync
```

Resoniteのユニットパッケージを同期します。

### フィードバック機能

```bash
npm run feedback:unit      # フィードバックデータ取得 & ユニット添付
npm run feedback:fetch     # フィードバックデータ取得のみ
npm run feedback:attachUnit # ユニット添付のみ
```

Resonite内でのフィードバックを取得・処理します。

## 依存モジュール

- `@unispace-meteor/common`: 共通ユーティリティ
- `@unispace-meteor/miragex`: Resonite向けReact Reconciler
- `@unispace-meteor/simulator`: 隕石シミュレーション計算

## 技術スタック

- **フレームワーク**: Express
- **WebSocket**: ws
- **認証**: jose (JWT)
- **Resonite統合**: MirageX, brson.js, json2emap
- **言語**: TypeScript
- **ビルド**: TypeScript Compiler + tsc-watch
