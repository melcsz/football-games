import { DebateOption } from "./DebateOption";

export function DailyDebate() {
  return (
    <section className="mb-4 rounded-md border border-white/10 bg-[#1E293B] p-3 sm:flex sm:items-center sm:justify-between sm:gap-4">
      <div className="min-w-0">
        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#FACC15]">
          Daily Debate
        </p>

        <h1 className="mt-1 text-sm font-black text-white sm:text-base">
          Who is the GOAT?
        </h1>
      </div>

      <div className="mt-3 grid gap-2 sm:mt-0 sm:w-[26rem] sm:grid-cols-2">
        <DebateOption name="Messi" percent={58} />
        <DebateOption name="Ronaldo" percent={42} />
      </div>
    </section>
  );
}