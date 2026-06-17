"use client";

import { useState } from "react";

const budgets = ["Under ₹25K", "₹25K–₹75K", "₹75K–₹2L", "Let's discuss"];

/** Frontend-only contact: composes a structured email via mailto so it works
 *  with zero backend. Swap for a form service later if desired. */
export default function ContactForm() {
  const [budget, setBudget] = useState("");

  const submit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const subject = encodeURIComponent(
      `Project enquiry: ${data.get("business") || data.get("name")}`
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
    "w-full border-b border-iron bg-transparent py-3 text-base text-white placeholder:text-ash-dim focus:border-kinetic focus:outline-none transition-none";
  const labelCls = "label-mono label-mono--ash";

  return (
    <form onSubmit={submit} className="flex flex-col gap-9 border border-iron bg-onyx-raise p-7 md:p-9">
      <label className="flex flex-col gap-2">
        <span className={labelCls}>Your name</span>
        <input required name="name" autoComplete="name" className={field} placeholder="Asha Nair" />
      </label>

      <label className="flex flex-col gap-2">
        <span className={labelCls}>Your business</span>
        <input name="business" autoComplete="organization" className={field} placeholder="Nair Textiles, Kochi" />
      </label>

      <fieldset className="flex flex-col gap-3">
        <legend className={labelCls}>Rough budget</legend>
        <div className="mt-1 flex flex-wrap gap-2">
          {budgets.map((b) => (
            <button
              key={b}
              type="button"
              onClick={() => setBudget(b)}
              aria-pressed={budget === b}
              className={`border px-4 py-2 font-mono text-xs uppercase tracking-[0.1em] transition-none ${
                budget === b
                  ? "border-kinetic bg-kinetic text-onyx"
                  : "border-iron text-ash hover:border-kinetic hover:text-white"
              }`}
            >
              {b}
            </button>
          ))}
        </div>
      </fieldset>

      <label className="flex flex-col gap-2">
        <span className={labelCls}>What do you need?</span>
        <textarea
          required
          name="message"
          rows={5}
          className={field}
          placeholder="In your own words: what's slowing you down, or what do you want to exist?"
        />
      </label>

      <button type="submit" className="btn-primary justify-center">
        Send it over <span aria-hidden="true">→</span>
      </button>
      <p className="label-mono label-mono--ash text-center">
        Opens your email app. Nothing is stored here.
      </p>
    </form>
  );
}
