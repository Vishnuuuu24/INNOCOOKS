"use client";

import { useState } from "react";
import {
  CONTACT_ENDPOINT,
  hasContactEndpoint,
  contactMailto,
  sendContact,
  validateContact,
  type ContactPayload,
} from "@/lib/contact";

const budgets = ["Under ₹25K", "₹25K–₹75K", "₹75K–₹2L", "Let's discuss"];

type Status = "idle" | "submitting" | "success" | "error";

/** "Get in touch" form. By default it composes a structured `mailto:` so the
 *  site works with zero backend. Set NEXT_PUBLIC_CONTACT_ENDPOINT (see
 *  lib/contact.ts + .env.example) and it POSTs the enquiry to your backend or
 *  email service instead — with inline success/error states, a spam honeypot
 *  and a no-JS native fallback. */
export default function ContactForm() {
  const [budget, setBudget] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("");

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (status === "submitting") return;
    const form = e.currentTarget;
    const data = new FormData(form);

    // honeypot: bots fill hidden fields, humans never see them → silently drop
    if ((data.get("company_website") as string)?.trim()) {
      setStatus("success");
      setMessage("Thanks — we'll be in touch shortly.");
      return;
    }

    const payload: ContactPayload = {
      name: ((data.get("name") as string) || "").trim(),
      email: ((data.get("email") as string) || "").trim(),
      business: ((data.get("business") as string) || "").trim(),
      budget,
      message: ((data.get("message") as string) || "").trim(),
    };

    const invalid = validateContact(payload);
    if (invalid) {
      setStatus("error");
      setMessage(invalid);
      return;
    }

    // No endpoint configured → preserve the original zero-backend behaviour.
    if (!hasContactEndpoint) {
      window.location.href = contactMailto(payload);
      return;
    }

    setStatus("submitting");
    setMessage("");

    // 15s timeout so a hung network never leaves the button spinning forever.
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 15000);

    const result = await sendContact(payload, controller.signal);
    clearTimeout(timer);

    if (result.ok) {
      setStatus("success");
      setMessage("Got it. We'll reply within 24 hours.");
      form.reset();
      setBudget("");
    } else {
      setStatus("error");
      setMessage(result.error);
    }
  };

  const field =
    "w-full border-b border-iron bg-transparent py-3 text-base text-white placeholder:text-ash-dim focus:border-kinetic focus:outline-none transition-none disabled:opacity-50";
  const labelCls = "label-mono label-mono--ash";
  const submitting = status === "submitting";

  return (
    <form
      onSubmit={submit}
      // native fallback if JS is unavailable and an endpoint is configured
      action={hasContactEndpoint ? CONTACT_ENDPOINT : undefined}
      method={hasContactEndpoint ? "POST" : undefined}
      aria-busy={submitting}
      noValidate
      className="flex flex-col gap-9 border border-iron bg-onyx-raise p-7 md:p-9"
    >
      <label className="flex flex-col gap-2">
        <span className={labelCls}>Your name</span>
        <input
          required
          name="name"
          autoComplete="name"
          disabled={submitting}
          className={field}
          placeholder="Asha Nair"
        />
      </label>

      <label className="flex flex-col gap-2">
        <span className={labelCls}>Your email</span>
        <input
          required
          type="email"
          name="email"
          inputMode="email"
          autoComplete="email"
          disabled={submitting}
          className={field}
          placeholder="asha@nairtextiles.in"
        />
      </label>

      <label className="flex flex-col gap-2">
        <span className={labelCls}>Your business</span>
        <input
          name="business"
          autoComplete="organization"
          disabled={submitting}
          className={field}
          placeholder="Nair Textiles, Kochi"
        />
      </label>

      <fieldset className="flex flex-col gap-3">
        <legend className={labelCls}>Rough budget</legend>
        {/* mirrors the selected budget into the native POST / FormData */}
        <input type="hidden" name="budget" value={budget} />
        <div className="mt-1 flex flex-wrap gap-2">
          {budgets.map((b) => (
            <button
              key={b}
              type="button"
              onClick={() => setBudget(b)}
              aria-pressed={budget === b}
              disabled={submitting}
              className={`flex min-h-[44px] items-center border px-4 py-2 font-mono text-xs uppercase tracking-[0.1em] transition-none ${
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
          disabled={submitting}
          className={field}
          placeholder="In your own words: what's slowing you down, or what do you want to exist?"
        />
      </label>

      {/* honeypot — visually hidden, off the tab order, ignored by humans */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label>
          Company website
          <input
            type="text"
            name="company_website"
            tabIndex={-1}
            autoComplete="off"
          />
        </label>
      </div>

      <button
        type="submit"
        disabled={submitting}
        className="btn-primary justify-center disabled:cursor-not-allowed disabled:opacity-70"
      >
        {submitting ? (
          "Sending…"
        ) : status === "success" ? (
          "Sent ✓"
        ) : (
          <>
            Send it over <span aria-hidden="true">→</span>
          </>
        )}
      </button>

      {/* accessible status: errors interrupt (assertive), success is polite */}
      <p
        role={status === "error" ? "alert" : "status"}
        aria-live={status === "error" ? "assertive" : "polite"}
        className={`label-mono text-center ${
          status === "error"
            ? "text-kinetic-bright"
            : status === "success"
              ? "text-kinetic"
              : "label-mono--ash"
        }`}
      >
        {message ||
          (hasContactEndpoint
            ? "We reply within 24 hours. Your details are sent straight to us."
            : "Opens your email app. Nothing is stored here.")}
      </p>
    </form>
  );
}
