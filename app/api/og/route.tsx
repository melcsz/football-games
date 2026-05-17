import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";

export const runtime = "edge";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const title = searchParams.get("title") ?? "WeKnowBall Top 10";
  const score = searchParams.get("score") ?? "";

  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: 48,
          background: "#020617",
          color: "#f5f5f5",
          fontFamily: "Geist, Inter, system-ui",
        }}
      >
        <div
          style={{
            fontSize: 26,
            letterSpacing: "0.35em",
            textTransform: "uppercase",
            color: "#22c55e",
            marginBottom: 16,
            fontWeight: 700,
          }}
        >
          WeKnowBall
        </div>
        <div style={{ fontSize: 52, fontWeight: 900, lineHeight: 1.1 }}>
          {title}
        </div>
        {score ? (
          <div
            style={{
              marginTop: 28,
              fontSize: 36,
              fontWeight: 700,
              color: "#22c55e",
            }}
          >
            {score}
          </div>
        ) : null}
      </div>
    ),
    { width: 1200, height: 630 },
  );
}
