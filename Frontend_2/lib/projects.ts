/* Single source of truth for selected work. The homepage grid and every
 * /work/<slug>/ case-study page read from here, so adding a project is one
 * entry. Copy is grounded in each project's real, live positioning.
 * Drop a screenshot in /public/work/ and set `image` to render it. */

export type Phase = { label: string; body: string };

export type Project = {
  slug: string;
  title: string;
  kind: string; // short type label on the card
  year: string;
  meta: string; // sub-line under the case-study title
  badge: string; // status, shown on the card + eyebrow
  liveUrl?: string; // external "visit the live site"
  image?: string; // screenshot path, e.g. "/work/edits.jpg"
  summary: string; // one line, used for SEO description
  phases: Phase[];
  next?: string[]; // optional "shape of what's next" list
};

export const projects: Project[] = [
  {
    slug: "christalin-mirrors",
    title: "Christalin Mirrors",
    kind: "Website + Systems",
    year: "2025",
    meta: "Refined unisex salon · website · multi-branch systems (next)",
    badge: "Live in production",
    liveUrl: "https://christalinmirrors.com",
    image:
      "https://res.cloudinary.com/dktey3odk/image/upload/q_auto,f_auto/v1782107601/Screenshot_2026-06-22_at_11.20.32_AM_oald10.png",
    summary:
      "How InnoCooks designed and built the website for Christalin Mirrors, a refined unisex salon, and the multi-branch systems coming next.",
    phases: [
      {
        label: "The context",
        body: "Christalin Mirrors is a refined unisex salon with a clientele that expects polish, and a website that didn't reflect it. The owner found us through word of mouth and asked for a presence that matched the experience of walking through her doors.",
      },
      {
        label: "What we built",
        body: "We designed and built the site end-to-end: brand-true art direction, a calm editorial layout, fast load times on the phones her clients actually use, and a structure that makes booking an enquiry effortless. No template was harmed in the making. Every screen was drawn for her business.",
      },
      {
        label: "What it led to",
        body: "She stayed. The site is live in production under an annual care plan, and as Christalin Mirrors expands toward seven locations, we're now shaping the operating systems behind the growth: appointment booking, client records, staff and resource management across every branch.",
      },
    ],
    next: [
      "Appointment booking across branches",
      "Client records & history",
      "Staff scheduling & roles",
      "Inventory & resource management",
    ],
  },
  {
    slug: "the-edits-club",
    title: "The Edits Club",
    kind: "Brand + Portfolio",
    year: "2025",
    meta: "Video editing studio · brand + portfolio",
    badge: "Live",
    liveUrl: "https://theeditsclub.in",
    image:
      "https://res.cloudinary.com/dktey3odk/image/upload/q_auto,f_auto/v1782107603/Screenshot_2026-06-22_at_11.21.04_AM_bmhrac.png",
    summary:
      "Brand and portfolio for The Edits Club, a video editing and visual-storytelling studio, built to let the work play front and centre.",
    phases: [
      {
        label: "The context",
        body: "The Edits Club is a video editing and visual-storytelling studio. Their work is the pitch, so the site had to frame it without ever competing with it.",
      },
      {
        label: "What we built",
        body: 'A brand and portfolio site under the line "Stunning Video Editing & Visual Storytelling." Bold, restrained art direction with fast, smooth playback that reads premium on any screen.',
      },
    ],
  },
  {
    slug: "hacksters",
    title: "Hacksters",
    kind: "Studio Platform",
    year: "2026",
    meta: "Collective of builders · interactive studio platform",
    badge: "Live",
    liveUrl: "https://hacksters.tech",
    image:
      "https://res.cloudinary.com/dktey3odk/image/upload/q_auto,f_auto/v1782107603/Screenshot_2026-06-22_at_11.22.16_AM_pdzbaq.png",
    summary:
      "An interactive studio platform and portfolio for Hacksters, a collective of builders who call themselves the Innovators of Tomorrow.",
    phases: [
      {
        label: "The context",
        body: "Hacksters is a collective of builders who call themselves the Innovators of Tomorrow. They needed a platform as inventive as the work they ship.",
      },
      {
        label: "What we built",
        body: "An interactive, motion-rich studio platform and portfolio, engineered to feel alive the moment it loads while staying fast and production-solid.",
      },
    ],
  },
];

export function getProject(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}
