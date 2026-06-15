const items = [
  "Websites",
  "Internal systems",
  "AI workflows",
  "Agentic automation",
  "Design that converts",
  "Production-grade builds",
];

function Row({ hidden }: { hidden?: boolean }) {
  return (
    <ul
      aria-hidden={hidden}
      className="flex shrink-0 items-center gap-14 pr-14 font-mono text-xs uppercase tracking-[0.32em] text-gold"
    >
      {items.map((item) => (
        <li key={item} className="flex items-center gap-14 whitespace-nowrap">
          {item}
          <svg viewBox="0 0 40 12" fill="none" className="h-2.5 w-9 opacity-70" aria-hidden="true">
            <path
              d="M1 6 C 8 6, 10 2, 17 2 S 26 10, 33 10 S 38 6, 39 6"
              stroke="currentColor"
              strokeWidth="1.4"
              strokeLinecap="round"
            />
          </svg>
        </li>
      ))}
    </ul>
  );
}

export default function Marquee() {
  return (
    <section
      aria-label="What we build"
      className="overflow-hidden border-y border-cream/10 bg-dusk py-6"
    >
      <div className="animate-marquee flex w-max">
        <Row />
        <Row hidden />
      </div>
    </section>
  );
}
