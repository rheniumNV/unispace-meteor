import { R } from "@mobily/ts-belt";
import { simulateMeteorImpact } from "./simulation";
import { EARTH_RADIUS_M } from "./types/constants";
import type { SimulationInput, Vec3 } from "./types/input";

const r0_ecef: Vec3 = [EARTH_RADIUS_M + 10000, 0, 0]; // 上空10km
const velocity_ecef: Vec3 = [-10606.6, 0, 10606.6];
const input: SimulationInput = {
	discovery: {
		t0: new Date("2024-01-01T00:00:00Z"),
		r0_ecef,
		velocity_ecef,
	},
	meteoroid: {
		diameter_m: 1, // 1m径
		density_kg_m3: 3000,
		strength_mpa: 5,
	},
	environment: {
		surface: "land",
	},
};

const result = simulateMeteorImpact(input);
console.log(R.getExn(result));
