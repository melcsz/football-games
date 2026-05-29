import { z } from "zod";

export const gameTypeSchema = z.enum(["Top 10", "SECRET_PLAYER"]);

export type GameType = z.infer<typeof gameTypeSchema>;
