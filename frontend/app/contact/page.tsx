import type { Metadata } from "next";
import ContactForm from "@/components/ContactForm";

export const metadata: Metadata = {
  title: "Start a project",
  description:
    "Tell InnoCooks what's slowing your business down — we reply within 24 hours with how we'd approach it.",
};

export default function ContactPage() {
  return (
    <section className="bg-parch pt-20 text-ink">
      <div className="container-x grid gap-14 py-20 md:grid-cols-2 md:py-28">
        <div>
          <p className="label-mono">Start a project</p>
          <h1 className="display mt-5 text-[clamp(2.2rem,5vw,3.8rem)]">
            Tell us what you&apos;re trying to build.
          </h1>
          <p className="mt-7 max-w-md leading-relaxed text-muted">
            A website, an internal system, an AI workflow — or just a problem
            you can&apos;t name yet. Describe it in your own words; we&apos;ll
            reply within 24 hours with how we&apos;d approach it.
          </p>

          <ul className="mt-10 flex flex-col gap-3 font-mono text-xs uppercase tracking-[0.14em]">
            <li>
              <a
                href="mailto:vishnuuu24@gmail.com"
                className="transition-colors duration-300 hover:text-gold-deep"
              >
                ✉ vishnuuu24@gmail.com
              </a>
            </li>
            <li className="text-muted">Based in India — working everywhere</li>
          </ul>
        </div>

        <ContactForm />
      </div>
    </section>
  );
}
