import countriesJson from "@/data/countries/countries.json";
import clubsJson from "@/data/clubs/clubs.json";
import managersJson from "@/data/managers/managers.json";
import playersJson from "@/data/generated/players.generated.json";
import leaguesJson from "@/data/leagues/leagues.json";
import {
  parseEntity,
  type Entity,
  type EntityId,
  type EntityKind,
} from "@/data/schema";

function parseArray(raw: unknown[]): Entity[] {
  return raw.map((row) => parseEntity(row));
}

/** Validate referential integrity + unique IDs (runs at module load / build). */
function buildRegistry(entities: Entity[]): Map<EntityId, Entity> {
  const byId = new Map<EntityId, Entity>();
  const countryIds = new Set<string>();

  for (const e of entities) {
    if (byId.has(e.id)) {
      throw new Error(`Duplicate entity id: ${e.id}`);
    }
    byId.set(e.id, e);
    if (e.kind === "country") countryIds.add(e.id);
  }

  for (const e of entities) {
    if ("countryId" in e && e.countryId && !countryIds.has(e.countryId)) {
      throw new Error(`Unknown countryId ${e.countryId} on entity ${e.id}`);
    }
  }

  return byId;
}

const ALL_ENTITIES: Entity[] = [
  ...parseArray(countriesJson as unknown[]),
  ...parseArray(leaguesJson as unknown[]),
  ...parseArray(clubsJson as unknown[]),
  ...parseArray(managersJson as unknown[]),
  ...parseArray(playersJson as unknown[]),
];

export const ENTITY_BY_ID: ReadonlyMap<EntityId, Entity> =
  buildRegistry(ALL_ENTITIES);

export function getEntity(id: EntityId): Entity | undefined {
  return ENTITY_BY_ID.get(id);
}

export function requireEntity(id: EntityId): Entity {
  const e = ENTITY_BY_ID.get(id);
  if (!e) throw new Error(`Unknown entity id: ${id}`);
  return e;
}

export function allEntities(): readonly Entity[] {
  return ALL_ENTITIES;
}

export function entitiesByKind(kind: EntityKind): Entity[] {
  return ALL_ENTITIES.filter((e) => e.kind === kind);
}
