import { StickerShell } from "./StickerShell";

export function WordleSticker() {
  return (
    <StickerShell>
      <div className="grid w-24 grid-cols-3 gap-1.5">
        {Array.from({ length: 9 }).map((_, index) => {
          const green = [0, 4, 7].includes(index);
          const yellow = [2, 5].includes(index);

          return (
            <span
              key={index}
              className={`aspect-square rounded-sm ${
                green
                  ? "bg-[#22C55E]"
                  : yellow
                    ? "bg-[#FACC15]"
                    : "bg-white"
              }`}
            />
          );
        })}
      </div>
    </StickerShell>
  );
}