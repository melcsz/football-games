import { z } from "zod";

export const entityKindSchema = z.enum([
  "player",
  "club",
  "manager",
  "country",
  "league",
]);

export type EntityKind = z.infer<typeof entityKindSchema>;

/** Human-readable slug ids: pl_*, cl_*, mg_*, co_*, lg_* */
export type EntityId = string;

const baseEntitySchema = z.object({
  id: z.string().min(1),
  kind: entityKindSchema,
  name: z.string().min(1),
  aliases: z.array(z.string()).optional(),
  wikidataQid: z.string().optional(),
});

export const countrySchema = baseEntitySchema.extend({
  kind: z.literal("country"),
  iso2: z.string().length(2).optional(),
  flag: z.string().optional(),
});

export const leagueSchema = baseEntitySchema.extend({
  kind: z.literal("league"),
  countryId: z.string().optional(),
});

export const clubSchema = baseEntitySchema.extend({
  kind: z.literal("club"),
  countryId: z.string().optional(),
  founded: z.number().int().optional(),
});

export const playerSchema = baseEntitySchema.extend({
  kind: z.literal("player"),
  countryId: z.string().optional(),
  position: z.enum(["GK", "DF", "MF", "FW"]).optional(),
  birthYear: z.number().int().optional(),
});

export const managerSchema = baseEntitySchema.extend({
  kind: z.literal("manager"),
  countryId: z.string().optional(),
});

export const entitySchema = z.discriminatedUnion("kind", [
  playerSchema,
  clubSchema,
  managerSchema,
  countrySchema,
  leagueSchema,
]);

export type Country = z.infer<typeof countrySchema>;
export type League = z.infer<typeof leagueSchema>;
export type Club = z.infer<typeof clubSchema>;
export type Player = z.infer<typeof playerSchema>;
export type Manager = z.infer<typeof managerSchema>;
export type Entity = z.infer<typeof entitySchema>;

export function parseEntity(data: unknown): Entity {
  return entitySchema.parse(data);
}
