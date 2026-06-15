"use client";

import Link from "next/link";
import { useState } from "react";

const links = [
  { href: "/#services", label: "What we build" },
  { href: "/#work", label: "Work" },
  { href: "/#process", label: "Process" },
  { href: "/#studio", label: "Studio" },
];

/** Floating glass pill — dusk-tinted so it sits comfortably on both
 *  canvases as the page background breathes beneath it. */
export default function Nav() {
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed inset-x-0 top-4 z-50">
      <nav className="container-x">
        <div className="flex items-center justify-between rounded-full border border-cream/10 bg-dusk-deep/65 py-2 pl-6 pr-2 text-cream backdrop-blur-lg">
          <Link
            href="/"
            className="display text-base uppercase tracking-[0.16em]"
            onClick={() => setOpen(false)}
          >
            InnoCooks
          </Link>

          <ul className="hidden items-center gap-7 md:flex">
            {links.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  className="text-sm text-cream/85 transition-colors duration-300 hover:text-cream"
                >
                  {l.label}
                </Link>
              </li>
            ))}
            <li>
              <Link
                href="/contact/"
                className="inline-flex rounded-full bg-gold px-5 py-2.5 text-xs font-semibold uppercase tracking-wide text-dusk transition-[filter] duration-300 hover:brightness-110"
              >
                Start a project
              </Link>
            </li>
          </ul>

          <button
            className="flex flex-col gap-1.5 p-3 md:hidden"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen(!open)}
          >
            <span
              className={`block h-px w-6 bg-cream transition-transform duration-300 ${open ? "translate-y-[3.5px] rotate-45" : ""}`}
            />
            <span
              className={`block h-px w-6 bg-cream transition-transform duration-300 ${open ? "-translate-y-[3.5px] -rotate-45" : ""}`}
            />
          </button>
        </div>
      </nav>

      {/* mobile overlay */}
      <div
        className={`fixed inset-0 -z-10 bg-dusk transition-opacity duration-300 md:hidden ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      >
        <ul className="container-x flex flex-col gap-2 pt-28 text-cream">
          {links.map((l, i) => (
            <li key={l.href}>
              <Link
                href={l.href}
                onClick={() => setOpen(false)}
                className="display block py-3 text-3xl"
              >
                <span className="label-mono mr-4 text-gold">0{i + 1}</span>
                {l.label}
              </Link>
            </li>
          ))}
          <li className="pt-8">
            <Link href="/contact/" onClick={() => setOpen(false)} className="btn-gold">
              Start a project
            </Link>
          </li>
        </ul>
      </div>
    </header>
  );
}
