export function SecretPlayerSticker() {
  return (
    <div className="relative flex h-32 w-32 items-center justify-center">
      <div className="absolute h-28 w-28 rounded-full bg-[#F59E0B]/20 blur-xl" />

      <div className="relative flex h-24 w-24 items-center justify-center overflow-hidden rounded-full border-[6px] border-[#FACC15] bg-[#2F6B3A] shadow-[0_0_24px_rgba(245,158,11,0.35)]">
        <div className="absolute inset-3 rounded-full border border-white/25" />
        <div className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-white/25" />
        <div className="absolute left-1/2 top-1/2 h-8 w-8 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/30" />

        <svg
          viewBox="0 0 120 120"
          className="relative z-10 h-20 w-20 text-white/85 drop-shadow-[0_4px_0_rgba(0,0,0,0.35)]"
          fill="currentColor"
          aria-hidden
        >
          <circle cx="60" cy="30" r="15" />

          <rect x="51" y="43" width="18" height="12" rx="4" />

          <path d="M25 101c5-28 22-43 35-43s30 15 35 43H25z" />

          <path
            d="M48 60l12 13 12-13"
            fill="#2F6B3A"
            opacity="0.9"
          />
        </svg>
      </div>
      <div className="absolute bottom-3 right-2 h-12 w-5 rotate-[-45deg] rounded-full border-[3px] border-white bg-[#FACC15] shadow-[0_4px_0_rgba(0,0,0,0.35)]" />
    </div>
  );
}