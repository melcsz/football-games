import { ReactNode } from "react";

export type Game = {
  title: string;
  href: string;
  image: string;
  accent: string;
  tag: string;
  playLabel: string;
  description: string;
  sticker: ReactNode;
};