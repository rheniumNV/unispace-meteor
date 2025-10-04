import { R } from "@mobily/ts-belt";
import { simulateMeteorImpact } from "./simulation";
import { EARTH_RADIUS_M } from "./types/constants";
import type { SimulationInput } from "./types/input";

const input: SimulationInput = {
	discovery: {
		t0: new Date("2024-01-01T00:00:00Z"),
		r0_ecef: [EARTH_RADIUS_M + 20000, 0, 0], // 上空20km
		velocity: {
			magnitude_m_s: 20000, // 20 km/s
			azimuth_deg: 0,
			entry_angle_deg: 60, // 急角度
		},
	},
	meteoroid: {
		diameter_m: 50, // 50m径
		density_kg_m3: 3500, // 鉄質隕石
		strength_mpa: 100, // 非常に強い
	},
	environment: {
		surface: "land",
	},
};

const result = simulateMeteorImpact(input);
console.log(R.getExn(result));
