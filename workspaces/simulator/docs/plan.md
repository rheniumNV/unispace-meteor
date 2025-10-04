# 隕石シミュレーション API 実装仕様

## 前提
- **地球モデル**: 球近似（半径 \(R_\oplus \approx 6{,}371{,}000\ \mathrm{m}\)）
- **座標系**:
    - **ECEF**（Earth-Centered, Earth-Fixed）で位置を持つ
    - 局所座標 **ENU**（East/North/Up）で方位角と入射角を扱う
- **力学**: 地球の自転（角速度 \(\Omega \approx 7.2921159\times10^{-5}\ \mathrm{rad/s}\)）を考慮。重力・抗力・コリオリ・遠心力を含む。

---

## 入力
- **発見時点**
    - `t0`: 発見時刻（UTC）
    - `r0_ecef: vec3[m]`: 発見時のECEF座標
    - `v_dir_enu: {azimuth_deg, entry_angle_deg}`: 方位角と入射角（局所座標系）
    - `v0_mag: m/s`: 速度の大きさ
- **隕石の物性**
    - `diameter_m`
    - `density_kg_m3`
    - `strength_mpa`
- **環境**
    - `surface`: `"land"` | `"water"`
    - `rho0_kg_m3=1.225`, `scale_height_m=8000`
    - `gravity_m_s2=9.81`
- **モデルパラメータ**
    - `Cd=1.0`
    - `ablation_coeff`（省略可）
    - `seismic_efficiency=0.001`
    - `blast_thresholds_kpa=[1,3.5,10,20]`

---

## 出力
- **弾道**: 一定時間ごとの座標配列 `{t, r_ecef, v_ecef, alt_m}`
- **衝突までの時間**: `time_to_impact_s`
- **衝突時のエネルギー**: `E_joule`, `E_mt_tnt`
- **クレーター範囲**: `crater: {transient_diameter_m, final_diameter_m, depth_m}`
- **影響範囲**: `blast.damage_radii_km`（各過圧しきい値ごとの半径）
- **空中爆発情報**: `airburst: {burst_altitude_m, burst_energy_joule} | null`
- **地震規模**: `moment_magnitude_M`

---

## 必要な関数

### 1. 座標変換
- `enuBasisAt(lat, lon) -> {E,N,U}`
    - 緯度経度から ENU 基底ベクトルを作る
- `ecefToGeodetic(r_ecef) -> {lat, lon, alt_m}`
    - 球モデルでのECEF→地理座標変換
- `initialVelocityFromAzEl(v0_mag, az, gamma, basis) -> v_ecef`
    - ENUの方位角と入射角からECEF速度ベクトルを得る

### 2. 運動方程式
- `rhsState(t, state, params) -> d/dt(state)`
    - 位置 r, 速度 v, 質量 m の時間変化を返す
    - 力学:
        - 重力 \( \mathbf g = -\mu \mathbf r / ||\mathbf r||^3 \)
        - コリオリ力 \( -2 \Omega \times v \)
        - 遠心力 \( -\Omega \times (\Omega \times r) \)
        - 抗力 \( -\frac{C_d A}{2m}\rho(h)||v_{rel}||v_{rel} \)
        - 大気密度 \( \rho(h)=\rho_0 e^{-h/H} \)
- `integrateTrajectory(r0, v0, m0, t0, params) -> samples[]`
    - Runge-Kuttaなどで数値積分。高度0以下または破砕で停止。

### 3. 破砕判定
- `dynamicPressure(r, v_rel, rho) -> q_pa`
- `breakupCheck(q, strength) -> bool`
    - \( q \geq Y \)（強度Pa）で破砕と判定
- `detectAirburst(samples, strength_mpa) -> {burst_alt_m, burst_E_joule} | null`

### 4. 衝突とクレーター
- `impactDetection(samples) -> impactState | null`
- `craterScaling(d, rho_i, v_imp, theta, rho_t, g) -> {D_trans, D_final, depth}`
    - 重力領域のスケーリング則
    - \( D_{tc} \propto (\rho_i/\rho_t)^{1/3} d^{0.78} v^{0.44} g^{-0.22} \sin^{1/3}\theta \)

### 5. 爆風影響
- `blastRadii(E_joule, burst_alt_m, thresholds) -> {kpa->radius_km}`
    - 核爆風のスケールド距離 \( Z = R / W^{1/3} \) を準用
    - \( W = E / 4.184\times10^{15} \) [Mt TNT]
    - \(p(Z)\) の経験式をログ補間で算出

### 6. 地震規模
- `seismicMagnitude(E_joule, eta) -> Mw`
    - \( E_s = \eta E,\quad M_w \approx \tfrac{2}{3}\log_{10}(E_s) - 3.2 \)

### 7. 結果まとめ
- `summarizeOutcome(samples, airburst?, impact?, params) -> SimulationResult`

---

## 使用する主な計算式と根拠文献
- **Impact Effects (Collins, Melosh, Marcus 2005)**  
  隕石破砕条件、クレーター径スケーリング、爆風・地震の経験式
- **Glasstone & Dolan, "The Effects of Nuclear Weapons"**  
  核爆風のスケーリング則 \( Z=R/W^{1/3} \)、過圧–距離関係
- **Gritsevich 他, meteoroid entry model**  
  単体流星体の抗力・アブレーション方程式
- **回転座標系力学（コリオリ・遠心項）**  
  地球自転を含む運動方程式の標準定式化
- **ECEF/ENU座標変換式**  
  測地座標変換の標準手法
