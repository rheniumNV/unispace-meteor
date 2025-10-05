![logo](./assets/logo.png)

# Planetary Defense Lab

**NASA Space Apps Challenge 2025 Ube** 参加プロジェクト

小惑星・隕石の地球への影響を誰でもわかりやすく理解できる、Resonite内で動作するインタラクティブな可視化・シミュレーションシステム

## チャレンジ

### Meteor Madness

https://www.spaceappschallenge.org/2025/challenges/meteor-madness/

**目的:**
小惑星衝突リスクの可視化・シミュレーション・軽減策評価を行うインタラクティブなツールを開発し、科学者・政策立案者・教育者・一般市民が小惑星の脅威を理解し対策を検討できるようにする。

**実装内容:**
- 軌道予測（Runge-Kutta 4次法による高精度な物理シミュレーション）
- 衝突エネルギー・クレーターサイズ計算
- 環境影響（爆風・地震波）のシミュレーション
- NASA NEO API、USGS データセット活用
- Resonite内でのインタラクティブな3D可視化

## イベント情報

**NASA Space Apps Challenge 2025 Ube**
https://www.spaceappschallenge.org/2025/local-events/ube/

- **日程:** 2025年10月4-5日
- **会場:** Ube Startup (山口県宇部市) + Resonite (バーチャル会場)
- **形式:** ハイブリッド開催

## プロジェクト概要

このリポジトリは、Resonite内で小惑星・隕石の被害を可視化し、弾道予測を誰でも直感的に扱えるUIとして実装するためのシステムです。

Web経由でResonite内にオブジェクト・UIを描画・処理する仕組みを提供し、物理的に正確なシミュレーション結果をインタラクティブに可視化します。

## アーキテクチャ

このプロジェクトはnpm workspacesを使用したモノレポ構成です。

```
unispace-meteor/
├── workspaces/
│   ├── simulator/      # 隕石衝突シミュレーション計算ライブラリ
│   ├── data-client/    # NASA API データ取得・変換ライブラリ
│   ├── console/        # Resonite統合サーバー
│   ├── miragex/        # Resonite向けReact Reconciler
│   └── common/         # 共通ユーティリティ
└── package.json
```

### モジュール

#### [@unispace-meteor/simulator](./workspaces/simulator/README.md)

物理的に正確な隕石の大気圏突入・衝突シミュレーション計算ライブラリ

- Runge-Kutta 4次法による高精度な軌道計算
- 重力、抗力、コリオリ力、遠心力を含む完全な運動方程式
- 空中爆発検出、クレーター計算、爆風影響、地震規模計算
- Collins et al. (2005) のスケーリング則、Glasstone & Dolan の核爆風スケーリング

#### [@unispace-meteor/data-client](./workspaces/data-client/README.md)

NASA JPL CAD APIから地球接近小惑星データを取得し、シミュレーター入力形式に変換するライブラリ

- NASA NEO APIとの統合
- 接近日時、距離、速度、直径などのデータ取得
- ECEF座標系への変換

#### [@unispace-meteor/console](./workspaces/console/README.md)

Resonite統合用のExpressサーバー

- WebSocketでシミュレーション結果をリアルタイム配信
- MirageXを使用してResonite内にUI/オブジェクトを描画
- RESTful API提供

#### [@unispace-meteor/miragex](./workspaces/miragex/README.md)

Resonite向けのReact Reconciler

- Web技術でResonite内オブジェクトを宣言的に構築
- VirtualObjectシステムによる抽象化
- フレーム生成・アタッチ機能

#### @unispace-meteor/common

共通ユーティリティとResonite関連機能

- Resonite API クライアント
- Brson (Binary JSON) 加工・生成
- 型定義と便利関数

## セットアップ

### 必要環境

- Node.js 22.20.0 (Voltaで自動管理)
- npm

### インストール

```bash
npm install
```

### ビルド

```bash
# 全モジュールをビルド
npm run build

# 個別モジュールのビルド
npm run build:common
npm run build:simulator
npm run build:miragex
npm run build:console
```

### 開発モード

```bash
# 全モジュールを watch モードで起動
npm run dev

# 個別モジュールの開発
npm run dev:common
npm run dev:simulator
npm run dev:miragex
npm run dev:console
```

### その他のコマンド

```bash
# Lint
npm run lint

# Format
npm run format

# Clean
npm run clean
```

## 使い方

1. **データ取得**: `@unispace-meteor/data-client` でNASA APIから小惑星データを取得
2. **シミュレーション実行**: `@unispace-meteor/simulator` で軌道・影響を計算
3. **Resonite可視化**: `@unispace-meteor/console` + `@unispace-meteor/miragex` でResonite内に可視化

詳細は各モジュールのREADMEを参照してください。

## 技術スタック

- **言語**: TypeScript
- **ランタイム**: Node.js
- **関数型支援**: ts-belt
- **テスト**: vitest / jest
- **Lint/Format**: Biome / ESLint / Prettier
- **ビルド**: TypeScript Compiler
- **モノレポ**: npm workspaces
