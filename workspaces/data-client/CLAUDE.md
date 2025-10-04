# Data Clientモジュール
このモジュールは外部からデータを取得してきて使いやすいように加工して出力する目的があります

## 基本構成

- format, lint: Biome
  - https://biomejs.dev/guides/getting-started/
- test: vitest
  - https://vitest.dev/guide/
- 関数型支援: ts-belt
  - https://mobily.github.io/ts-belt/api/array

## コーディング方針

- 基本的に関数型アプローチで記述
  - ts-beltのRを使って関数はResultを返すように
  - 極力純粋関数になるように
  - コレクション操作もts-beltでpipeを極力使うように
- DRY原則を重視

## 実装内容

### NASA JPL CAD API クライアント
- 地球に接近する小惑星データを取得
- API: https://ssd-api.jpl.nasa.gov/doc/cad.html
- 取得データ: 接近日時、距離、速度、直径、絶対等級、フルネームなど

### データ変換機能
- CAD APIデータをSimulator入力形式に変換
- 座標計算: 緯度0度、経度0度方向にECEF配置
- 速度計算: 地球中心に向かう方向と仮定
- 質量計算: 直径から体積、密度（デフォルト2500kg/m³）で算出
- 直径未取得時: H-D関係式で推定（アルベド0.14仮定）

## 主要な関数

- `fetchCloseApproaches`: CAD APIから接近データを取得
- `convertToSimulationInput`: 単一データをシミュレーション入力に変換
- `fetchAndConvertCloseApproaches`: 取得と変換を一度に実行（推奨）
