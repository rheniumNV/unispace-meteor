# Simulatorモジュール
このモジュールは地球に隕石が落ちたときのシミュレーターの計算処理ライブラリです

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
- TDDを重視し、先にテストを書いて十分に精査してから実装を開始
- DRY原則を重視

## 実装内容
docs/plan.mdを参照

## NASAのReferences
- 軌道予測の参考: https://nasa.github.io/mission-viz/RMarkdown/Elliptical_Orbit_Design.html