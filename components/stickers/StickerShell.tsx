import type { ReactNode } from "react";

type StickerShellProps = {
  children: ReactNode;
};

export function StickerShell({ children }: StickerShellProps) {
  return (
    <div className="rounded-xl border-4 border-white bg-[#020617]/80 p-3 shadow-[0_8px_18px_rgba(0,0,0,0.35)]">
      {children}
    </div>
  );
}