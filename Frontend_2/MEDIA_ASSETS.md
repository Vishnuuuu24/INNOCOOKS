# Media Assets — INNOCOOKS Frontend 2

All project screenshots and media are hosted on **Cloudinary** (free tier).

---

## Where image URLs live

**Single source of truth:** [`lib/projects.ts`](lib/projects.ts)

Each project entry has an optional `image` field. Setting it activates the screenshot in two places automatically:
- The **Work grid** on the homepage (`components/sections/Work.tsx`)
- The **case-study page** at `/work/<slug>/` (`app/work/[slug]/page.tsx`)

If `image` is omitted, both places fall back to a styled title-card placeholder.

---

## Cloudinary account

| Field        | Value                      |
|--------------|----------------------------|
| Cloud name   | `dktey3odk`                |
| API key      | stored in `.env.local`     |
| Dashboard    | cloudinary.com/console     |

> Never commit the API Secret to git. Keep it in `.env.local` (already `.gitignore`-d).

---

## URL format

All URLs use Cloudinary's on-the-fly transformation parameters to avoid burning bandwidth/transformation credits on the free tier:

```
https://res.cloudinary.com/dktey3odk/image/upload/q_auto,f_auto/<version>/<public-id>.<ext>
```

| Param    | What it does                                                    |
|----------|-----------------------------------------------------------------|
| `q_auto` | Auto quality — Cloudinary picks the smallest file that still looks sharp. No manual tuning needed. |
| `f_auto` | Auto format — serves WebP or AVIF to browsers that support them; falls back to JPEG/PNG otherwise. |

These two params are the standard free-tier optimization. Do not add width/height transforms unless you need a specific resize — unnecessary transforms consume transformation credits.

---

## Current project screenshots

| Project            | Slug                 | Cloudinary public ID                                          |
|--------------------|----------------------|---------------------------------------------------------------|
| Christalin Mirrors | `christalin-mirrors` | `Screenshot_2026-06-22_at_11.20.32_AM_oald10`               |
| The Edits Club     | `the-edits-club`     | `Screenshot_2026-06-22_at_11.21.04_AM_bmhrac`               |
| Hacksters          | `hacksters`          | `Screenshot_2026-06-22_at_11.22.16_AM_pdzbaq`               |

---

## How to add a screenshot for a new project

1. **Upload** the screenshot to the Cloudinary Media Library (drag & drop in the dashboard, or use the CLI).
2. **Copy** the public ID from the asset detail panel.
3. **Add** the `image` field to the project entry in `lib/projects.ts`:

```ts
image: "https://res.cloudinary.com/dktey3odk/image/upload/q_auto,f_auto/v<version>/<public-id>.png",
```

That's it — no other files need to change.

---

## How to replace an existing screenshot

1. Upload the new image to Cloudinary. You can overwrite the same public ID (use "Overwrite" in the upload dialog) to keep the URL unchanged, or upload fresh and get a new public ID.
2. If the public ID changed, update the `image` field in `lib/projects.ts`.
3. Cloudinary CDN caches aggressively — if the URL didn't change, append `?v=<timestamp>` temporarily to bust the cache, then remove it once the new image is propagated.
