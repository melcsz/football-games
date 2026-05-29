import { NextRequest } from "next/server";

const themes: Record<string, { a: string; b: string; c: string }> = {
  top10: { a: "#064E3B", b: "#166534", c: "#22C55E" },
  secret: { a: "#451A03", b: "#92400E", c: "#F59E0B" },
  career: { a: "#0F172A", b: "#1D4ED8", c: "#3B82F6" },
  wordle: { a: "#111827", b: "#334155", c: "#F8FAFC" },
};

export function GET(
  req: NextRequest,
  { params }: { params: { width: string; height: string } },
) {
  const width = Math.max(1, Math.min(1200, Number(params.width) || 400));
  const height = Math.max(1, Math.min(1200, Number(params.height) || 320));
  const theme = req.nextUrl.searchParams.get("theme") ?? "top10";
  const colors = themes[theme] ?? themes.top10;

  const svg = `
    <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="g" x1="0" y1="0" x2="${width}" y2="${height}" gradientUnits="userSpaceOnUse">
          <stop stop-color="${colors.a}"/>
          <stop offset="0.58" stop-color="${colors.b}"/>
          <stop offset="1" stop-color="#020617"/>
        </linearGradient>
      </defs>
      <rect width="${width}" height="${height}" fill="url(#g)"/>
      <circle cx="${width * 0.22}" cy="${height * 0.18}" r="${width * 0.28}" fill="${colors.c}" opacity="0.18"/>
      <circle cx="${width * 0.78}" cy="${height * 0.72}" r="${width * 0.34}" fill="#ffffff" opacity="0.08"/>
      <path d="M0 ${height * 0.78} C ${width * 0.24} ${height * 0.52}, ${width * 0.52} ${height * 0.95}, ${width} ${height * 0.46}" stroke="#ffffff" stroke-opacity="0.14" stroke-width="3"/>
      <path d="M${width * 0.5} 0 V${height}" stroke="#ffffff" stroke-opacity="0.08" stroke-width="2"/>
      <circle cx="${width * 0.5}" cy="${height * 0.5}" r="${Math.min(width, height) * 0.18}" stroke="#ffffff" stroke-opacity="0.08" stroke-width="2"/>
    </svg>
  `;

  return new Response(svg, {
    headers: {
      "Content-Type": "image/svg+xml",
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}
