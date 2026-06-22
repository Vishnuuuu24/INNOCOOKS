"use client";

import { useRef, useState } from "react";
import { contactMailto, validateContact, type ContactPayload } from "@/lib/contact";
import { clientRateCheck, logClientSubmit } from "@/lib/rateLimit";

const budgets = ["Under ₹25K", "₹25K–₹75K", "₹75K–₹2L", "Let's discuss"];

type Status = "idle" | "submitting" | "success" | "error";

export default function ContactForm() {
  const [budget, setBudget]   = useState("");
  const [status, setStatus]   = useState<Status>("idle");
  const [message, setMessage] = useState("");
  // Track when the form was mounted — submitted too fast = bot signal
  const openedAt    = useRef(Date.now());
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const autoResize = () => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${el.scrollHeight}px`;
  };

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (status === "submitting") return;
    const form = e.currentTarget;
    const data = new FormData(form);

    // Honeypot — bots fill it, humans don't see it
    if ((data.get("company_website") as string)?.trim()) {
      setStatus("success");
      setMessage("Thanks — we'll be in touch shortly.");
      return;
    }

    const payload: ContactPayload = {
      name:     ((data.get("name")     as string) || "").trim(),
      email:    ((data.get("email")    as string) || "").trim(),
      business: ((data.get("business") as string) || "").trim(),
      budget,
      message:  ((data.get("message")  as string) || "").trim(),
    };

    const invalid = validateContact(payload);
    if (invalid) {
      setStatus("error");
      setMessage(invalid);
      return;
    }

    // Client-side device rate limit (localStorage — survives tab changes)
    const { allowed, retryIn } = clientRateCheck();
    if (!allowed) {
      setStatus("error");
      setMessage(`You've reached the submission limit. Try again in ${retryIn}.`);
      return;
    }

    setStatus("submitting");
    setMessage("");

    // POST to our own server-side API route — EmailJS keys never touch the browser
    let res: Response;
    try {
      res = await fetch("/api/contact/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...payload, openedAt: openedAt.current }),
        signal: AbortSignal.timeout(15000),
      });
    } catch {
      // Network failure — fall back to mailto so the lead is never lost
      window.location.href = contactMailto(payload);
      return;
    }

    if (res.ok) {
      logClientSubmit();
      setStatus("success");
      setMessage("Got it. We'll come back to you with a considered response.");
      form.reset();
      setBudget("");
    } else {
      let detail = "";
      try { detail = (await res.json()).error; } catch { /* non-JSON body */ }
      setStatus("error");
      setMessage(detail || "Something went wrong. Please try again.");
    }
  };

  // ── Shared class strings ──────────────────────────────────────────────────
  // ash-dim border makes the underline clearly readable against onyx-raise bg
  const field =
    "w-full border-b border-ash-dim bg-transparent pb-3 pt-1 text-base text-white " +
    "placeholder:text-ash/40 focus:border-kinetic focus:outline-none transition-none " +
    "disabled:opacity-50";
  const labelCls = "label-mono label-mono--ash";
  const submitting = status === "submitting";

  return (
    <form
      onSubmit={submit}
      aria-busy={submitting}
      noValidate
      className="flex flex-col gap-8 border border-iron-bright bg-onyx-raise p-7 md:p-9"
    >
      {/* ── Name ── */}
      <label className="flex flex-col gap-2.5">
        <span className={labelCls}>Your name</span>
        <input
          required
          name="name"
          autoComplete="name"
          disabled={submitting}
          maxLength={200}
          className={field}
          placeholder="Asha Nair"
        />
      </label>

      {/* ── Email ── */}
      <label className="flex flex-col gap-2.5">
        <span className={labelCls}>Your email</span>
        <input
          required
          type="email"
          name="email"
          inputMode="email"
          autoComplete="email"
          disabled={submitting}
          maxLength={200}
          className={field}
          placeholder="asha@nairtextiles.in"
        />
      </label>

      {/* ── Business ── */}
      <label className="flex flex-col gap-2.5">
        <span className={labelCls}>Your business</span>
        <input
          name="business"
          autoComplete="organization"
          disabled={submitting}
          maxLength={300}
          className={field}
          placeholder="Nair Textiles, Kochi"
        />
      </label>

      {/* ── Budget ── */}
      <fieldset className="flex flex-col gap-3">
        <legend className={labelCls}>Rough budget</legend>
        <input type="hidden" name="budget" value={budget} />
        <div className="mt-1 grid grid-cols-2 gap-2">
          {budgets.map((b) => (
            <button
              key={b}
              type="button"
              onClick={() => setBudget(b)}
              aria-pressed={budget === b}
              disabled={submitting}
              className={`flex min-h-[44px] items-center justify-center border px-4 py-2.5 font-mono text-xs uppercase tracking-[0.1em] transition-none ${
                budget === b
                  ? "border-kinetic bg-kinetic text-onyx"
                  : "border-iron-bright text-ash hover:border-kinetic hover:text-white"
              }`}
            >
              {b}
            </button>
          ))}
        </div>
      </fieldset>

      {/* ── Message ── */}
      <label className="flex flex-col gap-2.5">
        <span className={labelCls}>What do you need?</span>
        <textarea
          ref={textareaRef}
          required
          name="message"
          rows={4}
          disabled={submitting}
          maxLength={5000}
          onInput={autoResize}
          className={`${field} resize-none overflow-hidden`}
          placeholder="In your own words: what's slowing you down, or what do you want to exist?"
        />
      </label>

      {/* Honeypot — off-screen, ignored by humans, caught server-side too */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label>
          Company website
          <input type="text" name="company_website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      {/* ── Submit ── */}
      <button
        type="submit"
        disabled={submitting}
        className="btn-primary justify-center disabled:cursor-not-allowed disabled:opacity-70"
      >
        {submitting ? "Sending…" : status === "success" ? "Sent ✓" : <>Send it over <span aria-hidden="true">→</span></>}
      </button>

      {/* Accessible status */}
      <p
        role={status === "error" ? "alert" : "status"}
        aria-live={status === "error" ? "assertive" : "polite"}
        className={`label-mono text-center ${
          status === "error"   ? "text-kinetic-bright" :
          status === "success" ? "text-kinetic" :
          "label-mono--ash"
        }`}
      >
        {message || "Your details go straight to us. We read every message ourselves."}
      </p>
    </form>
  );
}
