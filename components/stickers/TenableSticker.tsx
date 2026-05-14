import { StickerShell } from "./StickerShell";

export function TenableSticker() {
  return (
    <StickerShell>
      <div className="w-24 space-y-1">
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="flex items-center gap-2">
            <span className="w-4 text-[10px] font-black text-[#22C55E]">
              {index + 1}
            </span>

            <span
              className="h-2 rounded-full bg-[#22C55E]"
              style={{ width: `${64 - index * 7}%` }}
            />
          </div>
        ))}
      </div>
    </StickerShell>
  );
}