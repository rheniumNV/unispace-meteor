# @unispace-meteor/data-client

外部データ取得・変換ライブラリ

NASA JPL CAD (Close Approach Data) APIから地球接近小惑星データを取得し、`@unispace-meteor/simulator` の入力形式に変換するライブラリです。

## 主要機能

- **NASA JPL CAD API クライアント**: 地球に接近する小惑星データを取得
- **データ変換**: CAD APIのデータをシミュレーター入力形式に自動変換
- **座標計算**: ECEF座標系への変換
- **質量推定**: 直径・密度から質量を計算、直径未取得時はH-D関係式で推定

## インストール

モノレポのルートから:

```bash
npm install
```

## クイックスタート

### 基本的な使い方

```typescript
import { fetchAndConvertCloseApproaches } from '@unispace-meteor/data-client';
import { simulateMeteorImpact } from '@unispace-meteor/simulator';
import { R } from '@mobily/ts-belt';

// 地球接近小惑星データを取得してシミュレーション入力に変換
const asteroids = await fetchAndConvertCloseApproaches();

// 各小惑星のシミュレーションを実行
for (const { name, input } of asteroids) {
  console.log(`シミュレーション実行: ${name}`);

  const result = simulateMeteorImpact(input);

  if (R.isOk(result)) {
    const sim = R.getExn(result);
    console.log('終了理由:', sim.terminationReason);
    console.log('エネルギー:', sim.energy.mt_tnt, 'Mt TNT');
  }
}
```

## API リファレンス

### メイン関数

#### `fetchAndConvertCloseApproaches(params?, densityKgM3?, albedo?)`

CAD APIからデータを取得し、シミュレーション入力に変換する（推奨）

**パラメータ:**
- `params` (オプショナル): CAD APIクエリパラメータ
  - デフォルト: `{ neo: true, body: "Earth", distMax: 0.05, fullname: true }`
- `densityKgM3` (オプショナル): 隕石の密度 [kg/m³]
  - デフォルト: `2500`（石質小惑星の典型値）
- `albedo` (オプショナル): アルベド（直径が不明な場合に使用）
  - デフォルト: `0.14`

**返り値:**
- `Promise<{ name: string; input: SimulationInput }[]>`

**例:**
```typescript
// デフォルト設定で取得
const asteroids = await fetchAndConvertCloseApproaches();

// カスタムパラメータで取得
const asteroids = await fetchAndConvertCloseApproaches(
  {
    dateMin: '2025-01-01',
    dateMax: '2025-12-31',
    distMax: 0.1,
  },
  3500,  // 密度を3500 kg/m³に設定
  0.20,  // アルベドを0.20に設定
);
```

### 個別関数

#### `fetchCloseApproaches(params?)`

CAD APIから地球接近小惑星データを取得

**パラメータ:**
- `params` (オプショナル): CADQueryParams
  - `dateMin`: 検索開始日 (YYYY-MM-DD)
  - `dateMax`: 検索終了日 (YYYY-MM-DD)
  - `distMin`: 最小接近距離 [au]
  - `distMax`: 最大接近距離 [au] (デフォルト: 0.05)
  - `hMax`: 最大絶対等級
  - `vInfMin`: 最小相対速度 [km/s]
  - `vInfMax`: 最大相対速度 [km/s]
  - `body`: 天体名 (デフォルト: "Earth")
  - `neo`: NEOのみ (デフォルト: true)
  - `fullname`: フルネーム取得 (デフォルト: true)

**返り値:**
- `Promise<CloseApproachData[]>`

**例:**
```typescript
import { fetchCloseApproaches } from '@unispace-meteor/data-client';

const data = await fetchCloseApproaches({
  dateMin: '2025-10-01',
  dateMax: '2025-10-31',
  distMax: 0.01,  // 0.01 au以内
});
```

#### `convertToSimulationInput(data, densityKgM3?, albedo?)`

単一の小惑星データをシミュレーション入力に変換

**パラメータ:**
- `data`: CloseApproachData
- `densityKgM3` (オプショナル): 密度 [kg/m³] (デフォルト: 2500)
- `albedo` (オプショナル): アルベド (デフォルト: 0.14)

**返り値:**
- `SimulationInput`

#### `convertMultipleToSimulationInput(dataList, densityKgM3?, albedo?)`

複数の小惑星データを一括変換

**パラメータ:**
- `dataList`: CloseApproachData[]
- `densityKgM3` (オプショナル): 密度 [kg/m³] (デフォルト: 2500)
- `albedo` (オプショナル): アルベド (デフォルト: 0.14)

**返り値:**
- `{ name: string; input: SimulationInput }[]`

## データフロー

```
NASA JPL CAD API
      ↓
fetchCloseApproaches()
      ↓
CloseApproachData[]
      ↓
convertToSimulationInput()
      ↓
SimulationInput
      ↓
@unispace-meteor/simulator
```

## データ変換の詳細

### 座標計算

接近データから以下のように座標を計算します:

1. **接近距離と速度から位置を計算**:
   - 緯度0度、経度0度方向にECEF配置
   - 距離: `distance_au * AU_TO_METERS`

2. **速度ベクトル**:
   - 地球中心に向かう方向と仮定
   - 大きさ: `velocity_km_s * 1000` [m/s]

### 質量計算

直径が取得できた場合:
```
体積 = (4/3) * π * (diameter/2)³
質量 = 体積 * 密度
```

直径が不明な場合（H-D関係式で推定）:
```
diameter = 1329 / √albedo * 10^(-0.2 * H)
```
- `H`: 絶対等級
- `albedo`: アルベド（反射率）

### デフォルト値

- **密度**: 2500 kg/m³（石質小惑星の典型値）
- **アルベド**: 0.14（C型小惑星の典型値）
- **強度**: 5 MPa（simulatorのデフォルト）
- **地表タイプ**: "land"

## NASA CAD API について

**APIエンドポイント:**
https://ssd-api.jpl.nasa.gov/cad.api

**公式ドキュメント:**
https://ssd-api.jpl.nasa.gov/doc/cad.html

**取得可能なデータ:**
- 接近日時 (JD, カレンダー日時)
- 距離 (au, LD)
- 相対速度 (km/s)
- 直径 (km)
- 絶対等級 (H)
- フルネーム

## 開発

### ビルド

```bash
# ルートから
npm run build:common  # 先にcommonをビルド
npm run build         # data-client含む全モジュールをビルド
```

### テスト

```bash
npm test              # 全テスト実行
npm run test:watch    # ウォッチモード
npm run test:ui       # UI モード
npm run test:coverage # カバレッジ計測
```

### Lint / Format

```bash
npm run lint          # Lint チェック
npm run lint:fix      # Lint 自動修正
npm run format        # Format
```

### クリーンアップ

```bash
npm run clean
```

## コーディング方針

- **関数型アプローチ**: ts-beltのResultを使用
- **純粋関数**: 副作用を最小化
- **DRY原則**: コードの重複を避ける

## 依存モジュール

- `@unispace-meteor/simulator`: シミュレーション計算（型定義のみ）

## 技術スタック

- **言語**: TypeScript
- **Lint/Format**: Biome
- **テスト**: vitest
- **ビルド**: TypeScript Compiler

## 型定義

### CloseApproachData

```typescript
interface CloseApproachData {
  des: string;              // 識別子
  orbit_id: string;         // 軌道ID
  jd: string;              // ユリウス日
  cd: string;              // カレンダー日時
  dist: string;            // 距離 [au]
  dist_min: string;        // 最小距離 [au]
  dist_max: string;        // 最大距離 [au]
  v_rel: string;           // 相対速度 [km/s]
  v_inf: string;           // 無限遠速度 [km/s]
  t_sigma_f: string;       // 時刻不確実性
  h: string;               // 絶対等級
  diameter?: string;       // 直径 [km] (オプショナル)
  diameter_sigma?: string; // 直径不確実性 (オプショナル)
  fullname?: string;       // フルネーム (オプショナル)
}
```

### SimulationInput

詳細は `@unispace-meteor/simulator` のドキュメントを参照してください。
