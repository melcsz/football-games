import { z } from "zod";

export const gameTypeSchema = z.enum(["tenaball", "SECRET_PLAYER"]);

export type GameType = z.infer<typeof gameTypeSchema>;
