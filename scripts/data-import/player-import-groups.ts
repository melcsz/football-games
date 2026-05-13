export type PlayerImportGroup = {
  id: string;
  label: string;
  limit: number;
  /** Build a phase-1 query that returns ?player URIs (and optionally sitelinks). */
  buildTopIdsQuery: (limit: number) => string;
};

function leagueGroup(
  id: string,
  label: string,
  leagueQid: string,
  limit = 700,
): PlayerImportGroup {
  // Heuristic: current club has league (P118) = leagueQid.
  // Note: Wikidata data isn’t perfect; this is good enough for quiz relevance.
  return {
    id,
    label,
    limit,
    buildTopIdsQuery: (lim) => `
SELECT ?player ?sitelinks WHERE {
  ?player wdt:P106 wd:Q937857 .
  ?player wdt:P54 ?club .
  ?club wdt:P118 wd:${leagueQid} .
  ?player wikibase:sitelinks ?sitelinks .
}
ORDER BY DESC(?sitelinks)
LIMIT ${lim}
`,
  };
}

function legendsGroup(limit = 2000): PlayerImportGroup {
  return {
    id: "global-legends",
    label: "Global legends (top by sitelinks)",
    limit,
    buildTopIdsQuery: (lim) => `
SELECT ?player ?sitelinks WHERE {
  ?player wdt:P106 wd:Q937857 .
  ?player wikibase:sitelinks ?sitelinks .
}
ORDER BY DESC(?sitelinks)
LIMIT ${lim}
`,
  };
}

// Top five European leagues QIDs:
// Premier League: Q9448
// La Liga: Q324867
// Serie A: Q15804
// Bundesliga: Q82595
// Ligue 1: Q13394
const GROUPS: PlayerImportGroup[] = [
  leagueGroup(
    "premier-league-current",
    "Premier League (current players by club league)",
    "Q9448",
  ),
  leagueGroup(
    "la-liga-current",
    "La Liga (current players by club league)",
    "Q324867",
  ),
  leagueGroup(
    "serie-a-current",
    "Serie A (current players by club league)",
    "Q15804",
  ),
  leagueGroup(
    "bundesliga-current",
    "Bundesliga (current players by club league)",
    "Q82595",
  ),
  leagueGroup(
    "ligue-1-current",
    "Ligue 1 (current players by club league)",
    "Q13394",
  ),
  legendsGroup(2000),
];

export function getAllPlayerImportGroups(): PlayerImportGroup[] {
  return [...GROUPS];
}

export function resolvePlayerImportGroup(id: string): PlayerImportGroup {
  const g = GROUPS.find((x) => x.id === id);
  if (!g) {
    throw new Error(
      `Unknown import group '${id}'. Available: ${GROUPS.map((x) => x.id).join(", ")}`,
    );
  }
  return g;
}

