# @unispace-meteor/miragex

Resonite向けのReact Reconciler

Web技術（React）を使ってResonite内のオブジェクト・UIを宣言的に構築するためのフレームワークです。ReactコンポーネントをResoniteのスロットオブジェクトに変換し、VR空間内でインタラクティブなアプリケーションを実現します。

## 主要機能

- **React Reconciler**: ReactコンポーネントをResoniteオブジェクトに変換
- **VirtualObjectシステム**: Resoniteオブジェクトの抽象化レイヤー
- **フレーム生成**: Reactツリーから自動的にResoniteフレームを生成
- **WebSocketサーバー**: リアルタイム通信でResoniteと連携
- **Brsonエクスポート**: Resonite互換のバイナリフォーマットで出力

## アーキテクチャ

```
miragex/
├── src/
│   ├── main/        # React Reconciler本体
│   ├── res/         # Resoniteオブジェクト定義
│   ├── server/      # WebSocketサーバー
│   ├── unit/        # Resoniteユニット定義
│   ├── util/        # ユーティリティ
│   ├── script/      # フレーム生成・アタッチスクリプト
│   ├── dev/         # 開発ツール
│   ├── common/      # 共通定義
│   └── web/         # Web UI（オプション）
└── package.json
```

## インストール

モノレポのルートから:

```bash
npm install
```

## 使い方

### 基本的な使い方

#### 1. Reactコンポーネントを作成

```tsx
import React from "react";

export const MyApp = () => {
  return (
    <slot name="Root">
      <slot name="Container">
        <text content="Hello Resonite!" />
        <button onClick={() => console.log("Clicked!")}>Click Me</button>
      </slot>
    </slot>
  );
};
```

#### 2. MirageXサーバーを起動

```typescript
import {
  MirageXServer,
  MirageXServerConfig,
} from "@unispace-meteor/miragex/dist/server";
import { MyApp } from "./MyApp";

const config: MirageXServerConfig = {
  mirage: {
    url: "http://localhost",
    port: 3000,
    serverId: "my-server-id",
    apiPath: {
      info: "/info",
      output: "/output.brson",
      auth: "/auth/:connectionId",
      interactionEvent: "/events",
      websocket: "/ws",
    },
  },
};

const server = new MirageXServer(config);
server.start();
```

#### 3. Resoniteフレームを生成

```bash
npm run feedback:attach:frame:simple
```

これにより、Reactコンポーネントが変換されてResonite互換のBrsonファイルが生成されます。

#### 4. Resonite内にインポート

生成されたBrsonファイルをResonite内にインポートして使用します。

## VirtualObjectシステム

MirageXは独自のVirtualObjectシステムを使用してResoniteオブジェクトを抽象化します。

### 主要コンセプト

- **VirtualObject**: Resoniteオブジェクトの抽象表現
- **Slot**: Resoniteのスロット（コンテナ）
- **Component**: Resoniteのコンポーネント（機能）
- **Field**: コンポーネントのプロパティ

### 例

```typescript
const virtualSlot = {
  type: "slot",
  name: "MySlot",
  children: [
    {
      type: "component",
      componentType: "Text",
      fields: {
        content: "Hello World",
      },
    },
  ],
};
```

## フレーム生成

MirageXは以下の種類のフレームを生成できます:

### Core フレーム

```bash
npm run feedback:attach:core
```

アプリケーションのコア機能を含むフレーム

### インストールフレーム

```bash
npm run feedback:attach:frame:install
```

初回インストール用のフレーム（セットアップウィザードなど）

### シンプルフレーム

```bash
npm run feedback:attach:frame:simple
```

基本的なUIフレーム

### 一括生成

```bash
npm run feedback
```

全てのフレームを一度に生成します。

## 開発

### ビルド

```bash
# ルートから
npm run build:miragex

# または miragex ディレクトリ内で
npm run build
```

### 開発モード

```bash
# ルートから
npm run dev:miragex

# または miragex ディレクトリ内で
npm run dev
```

### Lint / Format

```bash
npm run lint        # Lint チェック（自動修正）
npm run format      # Format
```

### クリーンアップ

```bash
npm run clean
```

## スクリプト

### フィードバック取得

```bash
npm run feedback:fetch
```

Resonite内からフィードバックデータを取得します。

### フレームアタッチ

```bash
npm run feedback:attach:core              # Coreフレーム
npm run feedback:attach:frame:install     # インストールフレーム
npm run feedback:attach:frame:simple      # シンプルフレーム
```

## サーバー設定

MirageXサーバーは以下の設定を受け付けます:

```typescript
interface MirageXServerConfig {
  mirage: {
    url: string; // サーバーURL
    port: number; // ポート番号
    serverId: string; // サーバーID
    apiPath: {
      info: string; // 情報エンドポイント
      output: string; // Brson出力エンドポイント
      auth: string; // 認証エンドポイント
      interactionEvent: string; // インタラクションイベント
      websocket: string; // WebSocketエンドポイント
    };
  };
}
```

## 依存モジュール

- `@unispace-meteor/common`: 共通ユーティリティ（Resonite API、VirtualObject）
- `react`: UIコンポーネントフレームワーク
- `react-reconciler`: カスタムレンダラー
- `brson.js`: BrsonエンコーダーデコーダR
- `json2emap`: JSON → Emap変換
- `ws`: WebSocketサーバー

## 技術スタック

- **言語**: TypeScript
- **フレームワーク**: React, React Reconciler
- **通信**: WebSocket (ws)
- **シリアライゼーション**: Brson, json2emap
- **ビルド**: TypeScript Compiler + tsc-watch

## Resonite統合の仕組み

1. **Reactコンポーネント** → React Reconcilerで処理
2. **VirtualObject** → 中間表現として生成
3. **Brson** → Resonite互換フォーマットに変換
4. **Resonite** → インポートして表示

```
React Component
      ↓
React Reconciler (MirageX)
      ↓
VirtualObject Tree
      ↓
Brson Serialization
      ↓
Resonite Import
```

## ユースケース

- インタラクティブなVR UI構築
- データ可視化（3Dグラフ、チャートなど）
- 動的なオブジェクト生成
- リアルタイム更新が必要なアプリケーション

## 制限事項

- Resoniteのオブジェクトモデルに依存
- 全てのReactの機能が使えるわけではない（Reconcilerの実装範囲内）
- パフォーマンスはResonite側の制約を受ける

# MirageX（ミラージュ・クロス）α

MirageX は TypeScript×React で Resonite の開発を行えるフレームワークです。

[UniPocket](https://about.uni-pocket.com/ja)を作るために開発されました。
このリポジトリはUniPocketからMirageX部分を抽出して作られています。

現在は α 版であり破壊的な変更を頻繁にします。

サーバーサイドでメインロジックを動かし、Resonite では結果のみを表示するという仕組みになっています。
特殊な構成になるため、導入は慎重に検討してください。

主なメリット

- 以下の理由により、開発速度が早くなる。
  - React の作り方が使える。
  - 外部ライブラリが使える。
  - コードベースの開発ができる。
    - git が使える。
    - 再利用がしやすくなる。
- メインロジックを隠蔽できるため、ユーザーのチートを防ぎやすくなる。

主なデメリット

- 完成品にはインフラコストがかかる。
- ネットワークレイテンシーの影響を受ける。
- Resonite 上で改造できない。
