/**
 * NASA CAD APIからデータを取得して表示するサンドボックス
 */

import { fetchAndConvertCloseApproaches } from "./index";

const main = async () => {
	console.log("🌍 NASA CAD APIから地球接近小惑星データを取得中...\n");

	try {
		// 今日から1年後までの期間で、0.01 AU以内に接近する小惑星を取得
		const today = new Date();
		const oneYearLater = new Date();
		oneYearLater.setFullYear(today.getFullYear() + 1);

		const dateMin = today.toISOString().split("T")[0];
		const dateMax = oneYearLater.toISOString().split("T")[0];

		const results = await fetchAndConvertCloseApproaches({
			neo: true, // 地球近傍天体のみ
			distMax: 0.01, // 0.01 AU以内（約150万km、月までの距離の約4倍）
			dateMin,
			dateMax,
		});

		console.log(`✅ ${results.length}件の小惑星データを取得しました\n`);
		console.log("=" .repeat(80));

		// 各小惑星の情報を表示
		for (const [index, { name, input }] of results.entries()) {
			console.log(`\n【${index + 1}】 ${name}`);
			console.log("-".repeat(80));

			// 発見時点の情報
			console.log(`📅 接近日時: ${input.discovery.t0.toISOString()}`);
			console.log(
				`📍 ECEF座標 [m]: [${input.discovery.r0_ecef.map((v) => v.toExponential(3)).join(", ")}]`,
			);
			console.log(
				`🚀 速度ベクトル [m/s]: [${input.discovery.velocity_ecef.map((v) => v.toExponential(3)).join(", ")}]`,
			);

			// 隕石の物性
			console.log(`\n💎 隕石の物性:`);
			console.log(`  - 直径: ${input.meteoroid.diameter_m.toFixed(2)} m`);
			console.log(`  - 質量: ${input.meteoroid.mass_kg.toExponential(3)} kg`);
			if (input.meteoroid.strength_mpa !== undefined) {
				console.log(`  - 強度: ${input.meteoroid.strength_mpa} MPa`);
			}

			// 密度を計算して表示
			const radius_m = input.meteoroid.diameter_m / 2;
			const volume_m3 = (4 / 3) * Math.PI * radius_m ** 3;
			const density_kg_m3 = input.meteoroid.mass_kg / volume_m3;
			console.log(`  - 密度（計算値）: ${density_kg_m3.toFixed(0)} kg/m³`);

			// 速度の大きさを計算
			const v_mag = Math.sqrt(
				input.discovery.velocity_ecef[0] ** 2 +
					input.discovery.velocity_ecef[1] ** 2 +
					input.discovery.velocity_ecef[2] ** 2,
			);
			console.log(`\n⚡ 相対速度: ${(v_mag / 1000).toFixed(2)} km/s`);

			// 距離の大きさを計算
			const r_mag = Math.sqrt(
				input.discovery.r0_ecef[0] ** 2 +
					input.discovery.r0_ecef[1] ** 2 +
					input.discovery.r0_ecef[2] ** 2,
			);
			const AU_TO_M = 1.496e11;
			console.log(`📏 接近距離: ${(r_mag / AU_TO_M).toExponential(3)} AU`);
			console.log(`           = ${(r_mag / 1000).toFixed(0)} km`);

			console.log("=" .repeat(80));
		}

		// サマリー
		if (results.length > 0) {
			console.log(`\n📊 サマリー:`);
			console.log(`  - 取得期間: ${dateMin} 〜 ${dateMax}`);
			console.log(`  - 最大接近距離: 0.01 AU (約150万km)`);
			console.log(`  - 取得件数: ${results.length}件`);

			// 直径の範囲
			const diameters = results.map((r) => r.input.meteoroid.diameter_m);
			const minDiameter = Math.min(...diameters);
			const maxDiameter = Math.max(...diameters);
			console.log(`  - 直径範囲: ${minDiameter.toFixed(2)} m 〜 ${maxDiameter.toFixed(2)} m`);
		} else {
			console.log("\n⚠️ 指定期間・条件では小惑星が見つかりませんでした");
			console.log("💡 ヒント: distMaxを大きくするか、期間を広げてみてください");
		}
	} catch (error) {
		console.error("❌ エラーが発生しました:", error);
		if (error instanceof Error) {
			console.error(error.message);
		}
	}
};

main();
