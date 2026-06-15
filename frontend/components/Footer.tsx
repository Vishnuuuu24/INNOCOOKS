import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-dusk-deep text-cream">
      <div className="container-x flex flex-col gap-10 py-16 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="display text-2xl uppercase tracking-[0.14em]">InnoCooks</p>
          <p className="mt-3 max-w-xs text-sm leading-relaxed text-mist">
            Websites, internal systems and AI automation for growing
            businesses.
          </p>
        </div>

        <ul className="flex flex-col gap-2 text-sm md:items-end">
          <li>
            <a
              href="mailto:vishnuuu24@gmail.com"
              className="transition-colors duration-300 hover:text-gold"
            >
              vishnuuu24@gmail.com
            </a>
          </li>
          <li>
            <Link
              href="/contact/"
              className="transition-colors duration-300 hover:text-gold"
            >
              Start a project
            </Link>
          </li>
          <li className="text-mist">India</li>
        </ul>
      </div>

      <div className="container-x flex flex-col gap-2 border-t border-cream/10 py-6 text-xs text-mist md:flex-row md:justify-between">
        <p>© {new Date().getFullYear()} InnoCooks — Cooking Innovation</p>
        <p className="font-mono uppercase tracking-[0.14em]">
          Designed &amp; built by InnoCooks — no templates.
        </p>
      </div>
    </footer>
  );
}
