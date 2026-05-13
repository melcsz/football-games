/** Shape produced by import-wikidata-players (stage 1). */
export type RawWikidataPlayer = {
  wikidataQid: string;
  name: string;
  aliases: string[];
  countryName?: string;
  dateOfBirth?: string;
  positionName?: string;
  currentClubName?: string;
  wikipediaSitelinks: number;
  hasImage: boolean;
  /** Import group ids this row came from (e.g. premier-league-current). */
  importGroups: string[];
};

/** Stage 2 output. */
export type ScoredPlayer = RawWikidataPlayer & {
  relevanceScore: number;
};
