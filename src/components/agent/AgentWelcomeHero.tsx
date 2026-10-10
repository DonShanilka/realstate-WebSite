export function AgentWelcomeHero({ fullName }: { fullName?: string }) {
  return (
    <section className="relative overflow-hidden rounded-[2rem] bg-slate-950 px-6 py-9 text-white sm:px-10 sm:py-12 lg:px-14 lg:py-16">
      <div className="absolute -right-16 -top-32 h-80 w-80 rounded-full border border-white/10" />
      <div className="absolute -right-4 -top-20 h-56 w-56 rounded-full border border-white/10" />
      <div className="relative max-w-3xl">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-white/60">
          Your EstateAI workspace
        </p>
        <h2 className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl">
          Welcome{fullName ? `, ${fullName}` : " back"}.
        </h2>
        <p className="mt-4 max-w-xl text-base leading-7 text-white/70 sm:text-lg">
          A focused space to help you connect clients with the right property
          and keep every conversation moving.
        </p>
        <div className="mt-7 inline-flex items-center gap-2 rounded-full border border-white/20 px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-white/80">
          <span className="h-2 w-2 rounded-full bg-white" />
          Property agent
        </div>
      </div>
      <div className="relative mt-10 grid gap-3 border-t border-white/15 pt-5 text-sm text-white/60 sm:grid-cols-3 sm:gap-8">
        <p>Discover homes for your clients</p>
        <p>Coordinate property viewings</p>
        <p>Stay close to every inquiry</p>
      </div>
    </section>
  );
}
