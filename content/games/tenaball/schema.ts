import { z } from "zod";
import { entityKindSchema } from "@/data/schema";

export const categorySchema = z.enum(["legends", "current", "history"]);

export const tenaballAnswerSchema = z.object({
  rank: z.number().int().min(1).max(10),
  entityId: z.string().min(1),
  meta: z.string().optional(),
});

export const tenaballPuzzleSchema = z
  .object({
    id: z.string().regex(/^\d{4}$/),
    game: z.literal("tenaball"),
    publishDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    category: categorySchema,
    question: z.string().min(1),
    subtitle: z.string().optional(),
    source: z.string().optional(),
    validKinds: z.array(entityKindSchema).min(1),
    answers: z.array(tenaballAnswerSchema).length(10),
  })
  .superRefine((data, ctx) => {
    const ranks = data.answers.map((a) => a.rank).sort((a, b) => a - b);
    const expected = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    if (ranks.join(",") !== expected.join(",")) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "answers must include ranks 1 through 10 exactly once",
      });
    }
  });

export type TenaBallAnswer = z.infer<typeof tenaballAnswerSchema>;
export type TenaBallPuzzle = z.infer<typeof tenaballPuzzleSchema>;

export function parseTenaBallPuzzleJson(data: unknown): TenaBallPuzzle {
  return tenaballPuzzleSchema.parse(data);
}
