import { normalizeName } from "./text";

/** ASCII-ish slug with underscores (matches existing pl_lionel_messi style). */
export function slugify(displayName: string): string {
  const base = normalizeName(displayName);
  if (!base) return "unknown";
  const parts = displayName
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .split(/[\s._\-]+/)
    .filter(Boolean)
    .map((w) => w.replace(/[^a-z0-9]/gi, ""))
    .filter(Boolean);
  if (parts.length > 0) {
    return parts.join("_");
  }
  return base || "unknown";
}

export function playerEntityId(displayName: string): string {
  return `pl_${slugify(displayName)}`;
}
