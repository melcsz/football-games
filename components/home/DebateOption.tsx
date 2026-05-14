type DebateOptionProps = {
  name: string;
  percent: number;
};

export function DebateOption({ name, percent }: DebateOptionProps) {
  return (
    <button
      type="button"
      className="group rounded bg-[#0F172A] px-3 py-2 text-left transition-colors hover:bg-[#172338]"
    >
      <div className="flex items-center justify-between gap-3 text-xs font-black text-white">
        <span>{name}</span>
        <span className="text-[#FACC15]">{percent}%</span>
      </div>

      <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/10">
        <span
          className="block h-full rounded-full bg-[#FACC15] transition-colors group-hover:bg-[#FDE047]"
          style={{ width: `${percent}%` }}
        />
      </div>
    </button>
  );
}