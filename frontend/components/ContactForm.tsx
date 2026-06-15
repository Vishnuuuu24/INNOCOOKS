"use client";

import { useState } from "react";

const budgets = ["Under ₹25K", "₹25K–₹75K", "₹75K–₹2L", "Let's discuss"];

/** Frontend-only contact: composes a structured email via mailto so it
 *  works with zero backend. Swap for a form service later if desired. */
export default function ContactForm() {
  const [budget, setBudget] = useState("");

  const submit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const subject = encodeURIComponent(
      `Project enquiry — ${data.get("business") || data.get("name")}`
    );
    const body = encodeURIComponent(
      [
        `Name: ${data.get("name")}`,
        `Business: ${data.get("business")}`,
        `Budget: ${budget || "Not specified"}`,
        "",
        `${data.get("message")}`,
      ].join("\n")
    );
    window.location.href = `mailto:vishnuuu24@gmail.com?subject=${subject}&body=${body}`;
  };

  const field =
    "w-full rounded-xl border border-ink/20 bg-parch-soft px-4 py-3 text-sm placeholder:text-muted/60 focus:border-gold focus:outline-none transition-colors duration-300";

  return (
    <form onSubmit={submit} className="card-surface flex flex-col gap-5 p-7 md:p-9">
      <label className="flex flex-col gap-2 text-sm font-medium">
        Your name
        <input required name="name" autoComplete="name" className={field} placeholder="Asha Nair" />
      </label>

      <label className="flex flex-col gap-2 text-sm font-medium">
        Your business
        <input name="business" autoComplete="organization" className={field} placeholder="Nair Textiles, Kochi" />
      </label>

      <fieldset>
        <legend className="mb-2 text-sm font-medium">Rough budget</legend>
        <div className="flex flex-wrap gap-2">
          {budgets.map((b) => (
            <button
              key={b}
              type="button"
              onClick={() => setBudget(b)}
              aria-pressed={budget === b}
              className={`rounded-full border px-4 py-2 font-mono text-xs tracking-wide transition-colors duration-300 ${
                budget === b
                  ? "border-ink bg-ink text-cream"
                  : "border-ink/20 text-muted hover:border-gold"
              }`}
            >
              {b}
            </button>
          ))}
        </div>
      </fieldset>

      <label className="flex flex-col gap-2 text-sm font-medium">
        What do you need?
        <textarea
          required
          name="message"
          rows={5}
          className={field}
          placeholder="In your own words — what's slowing you down, or what do you want to exist?"
        />
      </label>

      <button type="submit" className="btn-ink justify-center">
        Send it over <span aria-hidden="true">→</span>
      </button>
      <p className="text-center font-mono text-[11px] uppercase tracking-[0.14em] text-muted">
        Opens your email app — nothing is stored here.
      </p>
    </form>
  );
}
