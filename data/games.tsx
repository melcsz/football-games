import type { Game } from "@/types/game";
import { TenableSticker } from "@/components/stickers/TenableSticker";
import { SecretPlayerSticker } from "@/components/stickers/SecretPlayerSticker";
import { CareerPathSticker } from "@/components/stickers/CareerPathSticker";
import { WordleSticker } from "@/components/stickers/WordleSticker";

export const games: Game[] = [
  {
    title: "Tenable",
    href: "/tenaball",
    image: "/api/placeholder/400/320?theme=tenable",
    accent: "#22C55E",
    tag: "LIVE",
    description: "Find the top ten before the board catches you out.",
    sticker: <TenableSticker />,
  },
  {
    title: "Secret Player",
    href: "/secret-player",
    image: "/api/placeholder/400/320?theme=secret",
    accent: "#F59E0B",
    tag: "NEW",
    description: "Three clues, one hidden footballer.",
    sticker: <SecretPlayerSticker />,
  },
  {
    title: "Career Path",
    href: "/career-path",
    image: "/api/placeholder/400/320?theme=career",
    accent: "#3B82F6",
    tag: "NEW",
    description: "Trace the moves and name the player.",
    sticker: <CareerPathSticker />,
  },
  {
    title: "Footy Wordle",
    href: "/footy-wordle",
    image: "/api/placeholder/400/320?theme=wordle",
    accent: "#FACC15",
    tag: "NEW",
    description: "Wordle logic for football names.",
    sticker: <WordleSticker />,
  },
];
