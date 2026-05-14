import { StickerShell } from "./StickerShell";

const careerPathNodes = [
  { x: 10, y: 62 },
  { x: 35, y: 42 },
  { x: 61, y: 43 },
  { x: 86, y: 18 },
];

export function CareerPathSticker() {
  return (
    <StickerShell>
      <svg
        className="h-20 w-24 text-[#3B82F6]"
        viewBox="0 0 96 80"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden
      >
        <path
          d="M10 62c12-36 58 8 76-44"
          stroke="currentColor"
          strokeWidth="6"
          strokeLinecap="round"
        />

        {careerPathNodes.map((node) => (
          <circle
            key={`${node.x}-${node.y}`}
            cx={node.x}
            cy={node.y}
            r="6"
            fill="#020617"
            stroke="currentColor"
            strokeWidth="4"
          />
        ))}
      </svg>
    </StickerShell>
  );
}