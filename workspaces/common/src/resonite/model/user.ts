import zod, { boolean, object, string } from "zod";

export const ResoniteUserSchema = object({
  id: string(),
  username: string(),
  normalizedUsername: string(),
  registrationDate: string(),
  isVerified: boolean(),
  isLocked: boolean(),
  supressBanEvasion: boolean(),
  tags: string().array().optional(),
  "2fa_login": boolean(),
  profile: object({
    iconUrl: string().optional(),
  }).optional(),
  migratedData: object({
    username: string(),
    userId: string(),
    registrationDate: string(),
  }).optional(),
});

export type ResoniteUser = zod.infer<typeof ResoniteUserSchema>;
