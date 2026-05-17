import type { Game } from "@/types/game";
import { Top10Sticker } from "@/components/stickers/Top10Sticker";
import { SecretPlayerSticker } from "@/components/stickers/SecretPlayerSticker";
import { CareerPathSticker } from "@/components/stickers/CareerPathSticker";
import { WordleSticker } from "@/components/stickers/WordleSticker";

export const games: Game[] = [
  {
    title: "Top 10 Challenge",
    href: "/top-10",
    image: "/api/placeholder/400/320?theme=top10",
    accent: "#22C55E",
    tag: "LIVE",
    playLabel: "Play Top 10",
    description: "Guess the correct football Top 10 ranking before your chances run out.",
    sticker: <Top10Sticker />,
  },
  {
    title: "Secret Player",
    href: "/secret-player",
    image: "/api/placeholder/400/320?theme=secret",
    accent: "#F59E0B",
    tag: "NEW",
    playLabel: "Play Secret Player",
    description: "Use clues to reveal the hidden footballer before you run out of guesses.",
    sticker: <SecretPlayerSticker />,
  },
  {
    title: "Career Path",
    href: "/career-path",
    image: "/api/placeholder/400/320?theme=career",
    accent: "#3B82F6",
    tag: "NEW",
    playLabel: "Play Career Path",
    description: "Follow the clubs and guess the footballer from their career journey.",
    sticker: <CareerPathSticker />,
  },
  {
    title: "Footy Wordle",
    href: "/footy-wordle",
    image: "/api/placeholder/400/320?theme=wordle",
    accent: "#FACC15",
    tag: "NEW",
    playLabel: "Play Footy Wordle",
    description: "Guess the football word in limited tries, one clue at a time.",
    sticker: <WordleSticker />,
  },
];