import type { Metadata } from "next";
import Link from "next/link";
import Reveal from "@/components/Reveal";

export const metadata: Metadata = {
  title: "Christalin Mirrors — Case study",
  description:
    "How InnoCooks designed and built the website for Christalin Mirrors, a refined unisex salon — and the multi-branch systems coming next.",
};

const phases = [
  {
    label: "The context",
    body: "Christalin Mirrors is a refined unisex salon with a clientele that expects polish — and a website that didn't reflect it. The owner found us through word of mouth and asked for a presence that matched the experience of walking through her doors.",
  },
  {
    label: "What we built",
    body: "We designed and built the site end-to-end: brand-true art direction, a calm editorial layout, fast load times on the phones her clients actually use, and a structure that makes booking an enquiry effortless. No template was harmed in the making — every screen was drawn for her business.",
  },
  {
    label: "What it led to",
    body: "She stayed. The site is live in production under an annual care plan, and as Christalin Mirrors expands toward seven locations, we're now shaping the operating systems behind the growth: appointment booking, client records, staff and resource management across every branch.",
  },
];

const next = [
  "Appointment booking across branches",
  "Client records & history",
  "Staff scheduling & roles",
  "Inventory & resource management",
];

export default function ChristalinPage() {
  return (
    <article className="bg-onyx pt-24">
      <header className="container-x border-b border-iron py-20 md:py-28">
        <Reveal>
          <p className="label-mono">[ CASE_STUDY // LIVE_IN_PRODUCTION ]</p>
          <h1 className="display h-hero mt-6 max-w-4xl text-white">Christalin Mirrors</h1>
          <p className="label-mono label-mono--ash mt-6">
            Refined unisex salon · website · multi-branch systems (next)
          </p>
        </Reveal>
      </header>

      <div className="container-x flex max-w-4xl flex-col gap-16 py-16 md:py-24">
        {phases.map((p, i) => (
          <Reveal key={p.label}>
            <section className="grid grid-cols-1 gap-4 md:grid-cols-12 md:gap-8">
              <p className="label-mono md:col-span-3">
                {String(i + 1).padStart(2, "0")} / {p.label}
              </p>
              <p className="display md:col-span-9 text-[clamp(1.35rem,2.4vw,2rem)] leading-[1.2] tracking-tight text-white" style={{ textTransform: "none" }}>
                {p.body}
              </p>
            </section>
          </Reveal>
        ))}

        <Reveal>
          <section className="border border-iron p-8 md:p-10">
            <p className="label-mono">// THE SHAPE OF WHAT&apos;S NEXT</p>
            <ul className="mt-6 grid grid-cols-1 gap-px border border-iron bg-iron sm:grid-cols-2">
              {next.map((item) => (
                <li key={item} className="flex items-center gap-3 bg-onyx px-5 py-5">
                  <span className="h-px w-6 bg-kinetic" aria-hidden="true" />
                  <span className="font-mono text-xs uppercase tracking-[0.12em] text-white">
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </section>
        </Reveal>

        <Reveal>
          <div className="flex flex-wrap items-center gap-4 pb-8">
            <Link href="/contact/" className="btn-primary">
              Build something like this <span aria-hidden="true">→</span>
            </Link>
            <a
              href="https://christalinmirrors.com"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-ghost"
            >
              Visit the live site ↗
            </a>
          </div>
        </Reveal>
      </div>
    </article>
  );
}
