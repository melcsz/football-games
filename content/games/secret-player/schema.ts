import { z } from "zod";

export const secretPlayerCloseGuessSchema = z.object({
  name: z.string().min(1),
  message: z.string().min(1),
});

export const secretPlayerPuzzleSchema = z.object({
  id: z.string().regex(/^\d{4}$/),
  game: z.literal("SECRET_PLAYER"),
  publishDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  hints: z.array(z.string().min(1)).length(3),
  answerId: z.string().min(1),
  closeGuesses: z.array(secretPlayerCloseGuessSchema),
});

export type SecretPlayerCloseGuess = z.infer<
  typeof secretPlayerCloseGuessSchema
>;
export type SecretPlayerPuzzle = z.infer<typeof secretPlayerPuzzleSchema>;

export function parseSecretPlayerPuzzleJson(
  data: unknown,
): SecretPlayerPuzzle {
  return secretPlayerPuzzleSchema.parse(data);
}
