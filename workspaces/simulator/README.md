# @unispace-meteor/simulator

隕石衝突シミュレーション計算ライブラリ

物理的に正確な隕石の大気圏突入・衝突シミュレーションを行い、軌道、エネルギー、クレーター、爆風、地震などを計算します。

## 主要機能

- **軌道積分**: Runge-Kutta 4次法による高精度な軌道計算
- **物理モデル**: 重力、抗力、コリオリ力、遠心力を含む完全な運動方程式
- **空中爆発検出**: 動圧による破砕判定
- **クレーター計算**: Collins et al. (2005) のスケーリング則
- **爆風影響**: Glasstone & Dolan の核爆風スケーリング
- **地震規模**: モーメントマグニチュード計算
- **脱出軌道検出**: 軌道エネルギーによる地球脱出判定

## インストール

```bash
npm install @unispace-meteor/simulator
```

または

```bash
bun add @unispace-meteor/simulator
```

## クイックスタート

```typescript
import { simulateMeteorImpact, type SimulationInput } from '@unispace-meteor/simulator';
import { R } from '@mobily/ts-belt';

// 入力データの準備
const input: SimulationInput = {
  discovery: {
    t0: new Date("2025-10-04T00:00:00Z"),
    r0_ecef: [-28_482_919, 16_444_621, 11_970_705], // ECEF座標 [m]
    velocity_ecef: [800, 1200, -300], // ECEF速度 [m/s]
  },
  meteoroid: {
    diameter_m: 250,      // 直径 [m]
    density_kg_m3: 3500,  // 密度 [kg/m³]
    strength_mpa: 50,     // 強度 [MPa]
  },
  environment: {
    surface: "land",      // 地表タイプ
  },
};

// シミュレーション実行
const result = simulateMeteorImpact(input);

if (R.isOk(result)) {
  const sim = R.getExn(result);

  console.log('終了理由:', sim.terminationReason);
  console.log('エネルギー:', sim.energy.mt_tnt, 'Mt TNT');
  console.log('空中爆発:', sim.airburst.isOccurrence);

  if (sim.crater.hasCrater) {
    console.log('クレーター直径:', sim.crater.final_diameter_m, 'm');
  }

  console.log('地震規模:', sim.seismic.moment_magnitude_M);
} else {
  console.error('エラー:', R.getError(result));
}
```

## API リファレンス

### メイン関数

#### `simulateMeteorImpact(input: SimulationInput): Result<SimulationResult, Error>`

隕石衝突シミュレーションを実行します。

**パラメータ:**
- `input`: シミュレーション入力パラメータ

**返り値:**
- `Result<SimulationResult, Error>`: 成功時はシミュレーション結果、失敗時はエラー

### ユーティリティ関数

#### `ecefToGeodetic(r_ecef: Vec3): Result<GeodeticCoord, Error>`

ECEF座標を地理座標（緯度・経度・高度）に変換します。

#### `geodeticToEcef(lat: number, lon: number, alt_m: number): Result<Vec3, Error>`

地理座標をECEF座標に変換します。

#### `calculateCrater(...): Result<CraterInfo, Error>`

クレーター直径と深さを計算します（Collins et al. 2005 のスケーリング則）。

#### `calculateSeismicMagnitude(energy_joule: number, seismic_efficiency?: number): Result<number, Error>`

モーメントマグニチュードを計算します。

#### `calculateBlastRadii(energy_joule: number, thresholds_kpa: readonly number[], burst_altitude_m: number): Result<Record<string, number>, Error>`

各過圧しきい値での爆風影響半径を計算します（Glasstone & Dolan）。

### 型定義

#### SimulationInput

```typescript
interface SimulationInput {
  discovery: {
    t0: Date;                    // 発見時刻（UTC）
    r0_ecef: Vec3;              // 発見時のECEF座標 [m]
    velocity_ecef: Vec3;        // 速度ベクトル ECEF [m/s]
  };
  meteoroid: {
    diameter_m: number;         // 直径 [m]
    density_kg_m3: number;      // 密度 [kg/m³]
    strength_mpa: number;       // 強度 [MPa]
  };
  environment: {
    surface: "land" | "water";  // 地表タイプ
    rho0_kg_m3?: number;        // 海面大気密度 [kg/m³] (デフォルト: 1.225)
    scale_height_m?: number;    // 大気スケールハイト [m] (デフォルト: 8000)
    gravity_m_s2?: number;      // 重力加速度 [m/s²] (デフォルト: 9.81)
  };
  model?: {
    drag_coefficient?: number;           // 抗力係数 (デフォルト: 1.0)
    ablation_coeff?: number;             // アブレーション係数 [s²/km²]
    seismic_efficiency?: number;         // 地震効率 (デフォルト: 0.001)
    blast_thresholds_kpa?: number[];     // 爆風過圧しきい値 [kPa]
    time_step_s?: number;                // タイムステップ [s] (デフォルト: 1)
    max_time_s?: number;                 // 最大シミュレーション時間 [s]
    escape_continue_time_s?: number;     // escape検出後の継続時間 [s] (デフォルト: 3600)
  };
}
```

#### SimulationResult

```typescript
interface SimulationResult {
  trajectory: TrajectoryPoint[];       // 軌道データ
  terminationReason: "ground" | "breakup" | "burnout" | "max_time" | "escape";
  end_time_s: number;                  // シミュレーション終了時刻 [s]
  energy: {
    joule: number;                     // エネルギー [J]
    mt_tnt: number;                    // TNT換算 [Mt]
  };
  airburst: AirburstInfo;              // 空中爆発情報
  crater: CraterInfo;                  // クレーター情報
  blast: {
    damage_radii_km: Record<string, number>;  // 爆風影響半径 [km]
  };
  seismic: {
    moment_magnitude_M: number;        // モーメントマグニチュード
  };
}
```

## 物理モデル詳細

### 前提条件

- **地球モデル**: 球近似（半径 $R_\oplus \approx 6{,}371{,}000$ m）
- **座標系**: ECEF（Earth-Centered, Earth-Fixed）
- **力学**: 地球の自転（角速度 $\Omega \approx 7.2921159\times10^{-5}$ rad/s）を考慮
- **重力**: 中心力場近似
- **大気**: 指数関数モデル $\rho(h) = \rho_0 e^{-h/H}$

### 運動方程式

隕石の運動は以下の方程式で記述されます：

$$
\frac{d\mathbf{r}}{dt} = \mathbf{v}
$$

$$
\frac{d\mathbf{v}}{dt} = \mathbf{g} + \mathbf{F}_d + \mathbf{F}_c + \mathbf{F}_{cf}
$$

$$
\frac{dm}{dt} = -\sigma A \rho v^3 \quad \text{(アブレーション、簡略化)}
$$

各力の定義：

- **重力**: $\mathbf{g} = -\dfrac{\mu}{||\mathbf{r}||^3} \mathbf{r}$ （$\mu$: 地球の重力定数）

- **抗力**: $\mathbf{F}_d = -\dfrac{C_d A \rho}{2m} ||\mathbf{v}_{rel}|| \mathbf{v}_{rel}$

- **コリオリ力**: $\mathbf{F}_c = -2{\Omega} \times \mathbf{v}$

- **遠心力**: $\mathbf{F}_{cf} = -{\Omega} \times ({\Omega} \times \mathbf{r})$

ここで、$\mathbf{v}_{rel} = \mathbf{v} - {\Omega} \times \mathbf{r}$ は大気との相対速度です。

### 数値積分

- **手法**: Runge-Kutta 4次法（RK4）
- **タイムステップ**: デフォルト 1秒（カスタマイズ可能）
- **サンプリング**: 適応的サンプリング
  - 速度の大きさが5%以上変化
  - 速度の向きが5度以上変化
  - 最後のサンプルから600秒以上経過

### 終了条件（terminationReason）

シミュレーションは以下のいずれかの条件で終了します：

| 終了理由 | 条件 | 空中爆発 | エネルギー | 地震 | 爆風 | クレーター |
|---------|------|---------|----------|------|------|----------|
| **ground** | 高度 ≤ 0 | ❌ | ✅ 計算 | ✅ 計算 | ✅ 計算 | ✅ 計算 |
| **breakup** | $q \geq Y$ | ✅ 発生 | ✅ 計算 | ❌ ゼロ | ✅ 計算 | ❌ なし |
| **escape** | $E > 0$ かつ遠ざかる | ❌ | ❌ ゼロ | ❌ ゼロ | ❌ なし | ❌ なし |
| **burnout** | 質量 < 1% | ❌ | ❌ ゼロ | ❌ ゼロ | ❌ なし | ❌ なし |
| **max_time** | タイムアウト | ❓ | ❓ | ❓ | ❓ | ❓ |

**重要**: `escape` と `burnout` の場合、隕石は地球に影響を与えないため、エネルギー・地震・爆風は全てゼロまたは未計算となります。

### 空中爆発（Airburst）

#### 判定条件

空中爆発は **`terminationReason === "breakup"`** の場合のみ発生します。

#### 物理モデル

- **動圧**: $q = \dfrac{1}{2}\rho v^2$

- **破砕条件**: $q \geq Y$ （$Y$: 隕石の強度 [Pa]）

動圧が隕石の強度を超えると、隕石は破砕され空中爆発します（例: 2013年チェリャビンスク）。

#### エネルギー

破砕時の運動エネルギー:

$$
E = \frac{1}{2}mv^2
$$

### クレーター（Crater）

**`ground`（地表衝突）の場合のみ計算されます。**

#### スケーリング則

Collins, Melosh, Marcus (2005) の重力領域スケーリング則:

$$
D_{tc} \propto \left(\frac{\rho_i}{\rho_t}\right)^{1/3} d^{0.78} v^{0.44} g^{-0.22} \sin^{1/3}\theta
$$

- $D_{tc}$: 一時クレーター直径
- $\rho_i$: 隕石密度
- $\rho_t$: 地表密度
- $d$: 隕石直径
- $v$: 衝突速度
- $g$: 重力加速度
- $\theta$: 衝突角度（水平面からの角度）

最終クレーター直径と深さも計算されます。

### 爆風（Blast）

**`ground` または `breakup` の場合のみ計算されます。**

#### スケーリング則

Glasstone & Dolan (1977) の核爆風スケーリング:

1. TNT換算: $W = \dfrac{E}{4.184 \times 10^{15}}$ [Mt TNT]

2. スケールド距離: $Z = \dfrac{R}{W^{1/3}}$ [m/Mt^{1/3}]

3. 過圧-距離関係: 経験式をログ補間で計算

各過圧しきい値（例: 1, 3.5, 10, 20 kPa）での影響半径を計算します。

### 地震規模（Seismic）

**`ground`（地表衝突）の場合のみ計算されます。**

#### モーメントマグニチュード

$$
M_w = \frac{2}{3}\log_{10}(E_s) - 3.2
$$

$$
E_s = \eta E
$$

- $E_s$: 地震エネルギー [J]
- $E$: 衝突エネルギー [J]
- $\eta$: 地震効率（デフォルト: 0.001）

### 脱出判定（Escape）

隕石が地球の重力圏から脱出する条件：

#### 軌道エネルギー

$$
E = \frac{v^2}{2} - \frac{\mu}{r} > 0
$$

#### 遠ざかる条件

$$
\mathbf{r} \cdot \mathbf{v} > 0
$$

高度 > 100 km で上記条件を満たすと脱出と判定され、指定時間（デフォルト: 3600秒）継続後に確定します。

**歴史的実例**: 1972年の地球接近天体は大気をかすめて（最低高度 ~58 km）、約100秒間大気と相互作用した後、再び宇宙空間へ脱出しました。

## 開発

### ビルド

```bash
bun run build
```

### テスト

```bash
bun run test          # 全テスト実行
bun run test:watch    # ウォッチモード
bun run test:ui       # UI モード
bun run test:coverage # カバレッジ計測
```

### Lint / Format

```bash
bun run lint          # Lint チェック
bun run lint:fix      # Lint 自動修正
bun run format        # Format
```

### コーディング方針

- **関数型アプローチ**: ts-belt の `Result` 型を使用
- **純粋関数**: 副作用を最小化
- **TDD**: テスト駆動開発
- **DRY**: コードの重複を避ける

## 参考文献

### 学術論文・資料

1. **Collins, G. S., Melosh, H. J., & Marcus, R. A. (2005)**
   "Earth Impact Effects Program: A Web-based computer program for calculating the regional environmental consequences of a meteoroid impact on Earth"
   *Meteoritics & Planetary Science*

2. **Glasstone, S., & Dolan, P. J. (1977)**
   "The Effects of Nuclear Weapons" (Third Edition)
   U.S. Department of Defense and Energy Research and Development Administration

3. **Popova, O. P., et al. (2013)**
   "Chelyabinsk Airburst, Damage Assessment, Meteorite Recovery, and Characterization"
   *Science*, 342(6162), 1069-1073

4. **Robertson, D. K., & Mathias, D. L. (2017)**
   "Effect of yield curves and porous crush on hydrocode simulations of asteroid airburst"
   *Journal of Geophysical Research: Planets*, 122, 599-613

5. **NASA Technical Reports**
   - Mission Viz: Elliptical Orbit Design
   - https://nasa.github.io/mission-viz/RMarkdown/Elliptical_Orbit_Design.html

### 歴史的事例

- **1972 Great Daylight Fireball**: 地球大気をかすめて脱出した天体の実例
- **2013 Chelyabinsk**: 空中爆発（airburst）の代表例（高度 ~23 km で破砕）

### オンラインツール

- **Impact Effects Calculator**
  https://impact.ese.ic.ac.uk/ImpactEarth/
