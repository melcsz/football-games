/**
 * Stage 1 (group import): import targeted player groups into per-group JSON files.\n+ *\n+ * Usage:\n+ * - npm run data:import:players -- --group premier-league-current\n+ * - npm run data:import:players -- --all\n+ * - npm run data:import:players -- --group global-legends --limit 300\n+ *\n+ * Writes:\n+ * - data/raw/players/<groupId>.json\n+ *\n+ * Reliability:\n+ * - POST requests, descriptive User-Agent\n+ * - retry with backoff (429/5xx/502/504)\n+ * - small batch size, delay between batches\n+ * - partial checkpointing per batch\n+ */
import fs from "node:fs";
import path from "node:path";
import { dedupeStrings } from "@/scripts/lib/text";
import { readJson, writeJsonPretty } from "@/scripts/lib/io";
import type { RawWikidataPlayer } from "@/scripts/lib/raw-player";
import {
  getAllPlayerImportGroups,
  resolvePlayerImportGroup,
  type PlayerImportGroup,
} from "@/scripts/data-import/player-import-groups";

const WD_ENDPOINT = "https://query.wikidata.org/sparql";
const USER_AGENT = "WeKnowBall-DataImport/0.1 (https://weknowball.com)";

const PLAYERS_DIR = "data/raw/players";
const DETAIL_BATCH = 20;
const BATCH_DELAY_MS = 900;

export type { RawWikidataPlayer } from "@/scripts/lib/raw-player";

function buildDetailQuery(valuesWd: string): string {
  return `
PREFIX wd: <http://www.wikidata.org/entity/>

SELECT ?player
  (MAX(?sitelinks) AS ?wikipediaSitelinks)
  (SAMPLE(?playerLabel) AS ?name)
  (SAMPLE(?countryLabel) AS ?countryName)
  (SAMPLE(?dob) AS ?dateOfBirth)
  (SAMPLE(?positionLabel) AS ?positionName)
  (SAMPLE(?clubLabel) AS ?currentClubName)
  (SAMPLE(?image) AS ?imageUri)
  (GROUP_CONCAT(DISTINCT ?alias; separator="|") AS ?aliasesJoined)
WHERE {
  VALUES ?player { ${valuesWd} }
  ?player wikibase:sitelinks ?sitelinks .
  ?player rdfs:label ?playerLabel . FILTER(LANG(?playerLabel) = "en")
  OPTIONAL { ?player wdt:P27 ?country . ?country rdfs:label ?countryLabel . FILTER(LANG(?countryLabel) = "en") }
  OPTIONAL { ?player wdt:P569 ?dob }
  OPTIONAL { ?player wdt:P413 ?position . ?position rdfs:label ?positionLabel . FILTER(LANG(?positionLabel) = "en") }
  OPTIONAL { ?player wdt:P54 ?club . ?club rdfs:label ?clubLabel . FILTER(LANG(?clubLabel) = "en") }
  OPTIONAL { ?player wdt:P18 ?image }
  OPTIONAL { ?player skos:altLabel ?alias . FILTER(LANG(?alias) = "en") }
}
GROUP BY ?player
`;
}

type SparqlBinding = {
  type: string;
  value: string;
  datatype?: string;
};

type SparqlResponse = {
  results?: { bindings: Record<string, SparqlBinding>[] };
};

function qidFromUri(uri: string): string {
  const m = /\/(Q\d+)$/.exec(uri);
  if (!m) throw new Error(`Could not parse QID from: ${uri}`);
  return m[1];
}

function getBinding(
  row: Record<string, SparqlBinding>,
  key: string,
): string | undefined {
  return row[key]?.value;
}

function parseSitelinks(raw: string | undefined): number {
  if (raw === undefined) return 0;
  const n = Number.parseInt(raw, 10);
  return Number.isFinite(n) ? n : 0;
}

function parseDob(raw: string | undefined): string | undefined {
  if (!raw) return undefined;
  if (/^\d{4}-\d{2}-\d{2}/.test(raw)) {
    return raw.slice(0, 10);
  }
  if (/^\d{4}$/.test(raw)) {
    return `${raw}-01-01`;
  }
  return raw;
}

function sleep(ms: number): Promise<void> {
  return new Promise((r) => setTimeout(r, ms));
}

async function sparqlFetch(query: string): Promise<SparqlResponse> {
  const params = new URLSearchParams();
  params.set("query", query);
  params.set("format", "json");

  let lastErr: Error | null = null;
  for (let attempt = 0; attempt < 8; attempt++) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 75_000);
    let res: Response;
    try {
      res = await fetch(WD_ENDPOINT, {
        method: "POST",
        headers: {
          Accept: "application/sparql-results+json",
          "Content-Type": "application/x-www-form-urlencoded",
          "User-Agent": USER_AGENT,
        },
        body: params.toString(),
        signal: controller.signal,
      });
    } catch (err) {
      lastErr =
        err instanceof Error
          ? err
          : new Error(`Wikidata SPARQL fetch failed: ${String(err)}`);
      await sleep(4000 * (attempt + 1));
      continue;
    } finally {
      clearTimeout(timeout);
    }
    if (
      res.status === 429 ||
      res.status === 504 ||
      (res.status >= 500 && res.status < 600)
    ) {
      const body = await res.text();
      lastErr = new Error(
        `Wikidata SPARQL ${res.status}: ${body.slice(0, 500)}`,
      );
      await sleep(4000 * (attempt + 1));
      continue;
    }
    if (!res.ok) {
      const body = await res.text();
      throw new Error(
        `Wikidata SPARQL failed ${res.status} ${res.statusText}: ${body.slice(0, 2000)}`,
      );
    }
    return (await res.json()) as SparqlResponse;
  }
  throw lastErr ?? new Error("Wikidata SPARQL: retries exhausted");
}

function rowToPlayer(
  row: Record<string, SparqlBinding>,
  groupId: string,
): RawWikidataPlayer {
  const playerUri = getBinding(row, "player");
  if (!playerUri) throw new Error("Missing ?player binding");
  const wikidataQid = qidFromUri(playerUri);
  const name = getBinding(row, "name")?.trim() ?? "";
  const aliasesJoined = getBinding(row, "aliasesJoined");
  const aliases = aliasesJoined
    ? dedupeStrings(
        aliasesJoined.split("|").map((s) => s.trim()).filter(Boolean),
      )
    : [];
  const imageUri = getBinding(row, "imageUri");
  return {
    wikidataQid,
    name,
    aliases,
    countryName: getBinding(row, "countryName")?.trim() || undefined,
    dateOfBirth: parseDob(getBinding(row, "dateOfBirth")),
    positionName: getBinding(row, "positionName")?.trim() || undefined,
    currentClubName: getBinding(row, "currentClubName")?.trim() || undefined,
    wikipediaSitelinks: parseSitelinks(getBinding(row, "wikipediaSitelinks")),
    hasImage: Boolean(imageUri?.length),
    importGroups: [groupId],
  };
}

function chunk<T>(arr: T[], size: number): T[][] {
  const out: T[][] = [];
  for (let i = 0; i < arr.length; i += size) {
    out.push(arr.slice(i, i + size));
  }
  return out;
}

async function main(): Promise<void> {
  const args = process.argv.slice(2);
  const groupIdx = args.indexOf("--group");
  const all = args.includes("--all");
  const limitIdx = args.indexOf("--limit");
  const limitOverride =
    limitIdx !== -1 && args[limitIdx + 1] ? Number(args[limitIdx + 1]) : null;

  const groups: PlayerImportGroup[] = all
    ? getAllPlayerImportGroups()
    : groupIdx !== -1 && args[groupIdx + 1]
      ? [resolvePlayerImportGroup(args[groupIdx + 1])]
      : [resolvePlayerImportGroup("premier-league-current")];

  fs.mkdirSync(PLAYERS_DIR, { recursive: true });

  for (const g of groups) {
    const effectiveLimit =
      typeof limitOverride === "number" && Number.isFinite(limitOverride)
        ? Math.max(1, Math.floor(limitOverride))
        : g.limit;
    await importGroup(g, effectiveLimit);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

async function importGroup(group: PlayerImportGroup, limit: number): Promise<void> {
  const outPath = path.join(PLAYERS_DIR, `${group.id}.json`);
  const checkpointPath = path.join(PLAYERS_DIR, `${group.id}.partial.json`);

  console.log(`\n== ${group.id} (${group.label}) limit=${limit} ==`);
  console.log("Fetching top ids…");
  const topQuery = group.buildTopIdsQuery(limit);
  const topJson = await sparqlFetch(topQuery);
  const topBindings = topJson.results?.bindings ?? [];
  const uris = topBindings
    .map((b) => getBinding(b, "player"))
    .filter((u): u is string => Boolean(u));

  if (uris.length === 0) {
    throw new Error(`Group ${group.id}: no players returned (top ids query).`);
  }
  console.log(`Top ids fetched: ${uris.length}. Fetching details…`);

  // Resume from checkpoint if present.
  let byQid = new Map<string, RawWikidataPlayer>();
  let startAt = 0;
  if (fs.existsSync(checkpointPath)) {
    try {
      const prev = readJson<RawWikidataPlayer[]>(checkpointPath);
      for (const p of prev) byQid.set(p.wikidataQid, p);
      startAt = byQid.size;
      console.log(`Resuming from checkpoint: ${startAt} already fetched`);
    } catch {
      /* ignore corrupt checkpoint */
    }
  }

  const batches = chunk(uris, DETAIL_BATCH);
  for (let bi = 0; bi < batches.length; bi++) {
    const fetchedSoFar = bi * DETAIL_BATCH;
    if (fetchedSoFar + DETAIL_BATCH <= startAt) continue;
    const batch = batches[bi];
    const valuesWd = batch.map((u) => `wd:${qidFromUri(u)}`).join(" ");
    const q = buildDetailQuery(valuesWd);
    const json = await sparqlFetch(q);
    const bindings = json.results?.bindings ?? [];
    for (const row of bindings) {
      const p = rowToPlayer(row, group.id);
      if (!p.name) continue;
      byQid.set(p.wikidataQid, p);
    }

    // Partial checkpoint per batch (overwrites).
    writeJsonPretty(checkpointPath, Array.from(byQid.values()));

    if ((bi + 1) % 5 === 0) {
      console.log(
        `  … ${Math.min((bi + 1) * DETAIL_BATCH, uris.length)} / ${uris.length}`,
      );
    }
    await sleep(BATCH_DELAY_MS);
  }

  const players = Array.from(byQid.values())
    .map((p) => ({ ...p, importGroups: dedupeStrings(p.importGroups) }))
    .sort((a, b) => a.name.localeCompare(b.name));

  writeJsonPretty(outPath, players);
  if (fs.existsSync(checkpointPath)) fs.rmSync(checkpointPath);
  console.log(`Imported ${players.length} players → ${outPath}`);
}
