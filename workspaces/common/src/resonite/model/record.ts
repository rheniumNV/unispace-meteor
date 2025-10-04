import zod, { object, literal, string, union, boolean, number } from "zod";

export const ResoniteDirectoryRecordSchema = object({
  creationTime: string(),
  id: string(),
  name: string(),
  ownerId: string(),
  path: string(),
  recordType: literal("directory"),
});

export const ResoniteLinkRecordSchema = object({
  assetUri: string(),
  creationTime: string(),
  id: string(),
  name: string(),
  ownerId: string(),
  path: string(),
  recordType: literal("link"),
});

export const ResoniteObjectRecordSchema = object({
  assetUri: string(),
  creationTime: string(),
  firstPublishedTime: string().optional(),
  id: string(),
  isDeleted: boolean(),
  isForPatron: boolean().optional(),
  isListed: boolean(),
  isPublic: boolean(),
  lastModificationTime: string(),
  name: string(),
  ownerId: string(),
  ownerName: string(),
  path: string(),
  randomOrder: number(),
  rating: number(),
  recordType: union([literal("object"), literal("world")]),
  submissions: number().optional(),
  thumbnailUri: string(),
  visits: number(),
});

export const ResoniteWorldRecordSchema = object({
  id: string(),
  assetUri: string(),
  name: string(),
  description: string(),
  recordType: literal("world"),
  ownerName: string(),
  ownerId: string(),
  tags: string().array(),
  thumbnailUri: string(),
  isPublic: boolean(),
  isForPatrons: boolean(),
  isListed: boolean(),
  isDeleted: boolean(),
  creationTime: string(),
  firstPublishedTime: string().optional(),
  lastModificationTime: string(),
  randomOrder: number(),
  visits: number(),
  rating: number(),
});

export const ResoniteRecordSchema = union([
  ResoniteObjectRecordSchema,
  ResoniteDirectoryRecordSchema,
  ResoniteLinkRecordSchema,
  ResoniteWorldRecordSchema,
]);

export type ResoniteDirectoryRecord = zod.infer<
  typeof ResoniteDirectoryRecordSchema
>;
export type ResoniteLinkRecord = zod.infer<typeof ResoniteLinkRecordSchema>;
export type ResoniteObjectRecord = zod.infer<typeof ResoniteObjectRecordSchema>;
export type ResoniteRecord = zod.infer<typeof ResoniteRecordSchema>;
