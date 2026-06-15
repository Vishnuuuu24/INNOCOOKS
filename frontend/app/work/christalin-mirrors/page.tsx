import type { Metadata } from "next";
import Link from "next/link";
import Reveal from "@/components/Reveal";
import ThreadDivider from "@/components/ThreadDivider";

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

export default function ChristalinPage() {
  return (
    <article className="bg-parch pt-20 text-ink">
      <header className="container-x py-20 md:py-28">
        <Reveal>
          <p className="label-mono">Case study — live in production</p>
          <h1 className="display mt-5 max-w-3xl text-[clamp(2.4rem,6vw,4.8rem)]">
            Christalin Mirrors
          </h1>
          <p className="mt-5 font-mono text-xs uppercase tracking-[0.18em] text-muted">
            Refined unisex salon · website · multi-branch systems (next)
          </p>
        </Reveal>
      </header>

      <ThreadDivider />

      <div className="container-x flex max-w-3xl flex-col gap-16 py-16 md:py-24">
        {phases.map((p, i) => (
          <Reveal key={p.label}>
            <section>
              <p className="label-mono">0{i + 1} — {p.label}</p>
              <p className="display mt-5 text-xl leading-relaxed md:text-2xl">
                {p.body}
              </p>
            </section>
          </Reveal>
        ))}

        <Reveal>
          <section className="card-surface px-7 py-8 md:px-10">
            <p className="label-mono">The shape of what&apos;s next</p>
            <ul className="mt-6 grid gap-3 font-mono text-xs uppercase tracking-[0.14em] md:grid-cols-2">
              {[
                "Appointment booking across branches",
                "Client records & history",
                "Staff scheduling & roles",
                "Inventory & resource management",
              ].map((item) => (
                <li key={item} className="flex items-center gap-3">
                  <span className="h-px w-6 bg-gold-deep" aria-hidden="true" />
                  {item}
                </li>
              ))}
            </ul>
          </section>
        </Reveal>

        <Reveal>
          <div className="flex flex-wrap items-center gap-5 pb-8">
            <Link href="/contact/" className="btn-ink">
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
