const items = [
  "Websites",
  "Internal systems",
  "AI workflows",
  "Agentic automation",
  "Design that converts",
  "Production-grade builds",
  "A year of care",
];

function Row({ hidden }: { hidden?: boolean }) {
  return (
    <ul
      aria-hidden={hidden}
      className="flex shrink-0 items-center gap-10 pr-10 font-mono text-sm uppercase tracking-[0.2em] text-white/80"
    >
      {items.map((item) => (
        <li key={item} className="flex items-center gap-10 whitespace-nowrap">
          {item}
          <span className="text-kinetic" aria-hidden="true">
            ///
          </span>
        </li>
      ))}
    </ul>
  );
}

export default function Marquee() {
  return (
    <section
      aria-label="What we build"
      className="overflow-hidden border-b border-iron bg-onyx py-5"
    >
      <div className="animate-ticker flex w-max">
        <Row />
        <Row hidden />
      </div>
    </section>
  );
}
