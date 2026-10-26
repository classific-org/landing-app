# Classific landing website

Marketing site for Classific, a software engineering studio. The app lives in this folder and is a Vite, React, and TypeScript static site with build-time prerendering.

## Requirements

- [Bun](https://bun.sh) 1.1 or later
- A production `SITE_ORIGIN` for builds (absolute `https` origin, not localhost)

## Setup

```bash
bun install
```

Copy `.env.example` and set values as needed. `SITE_ORIGIN` is required for `bun run build` and `bun run seo:generate`. `CONTACT_ENDPOINT` is optional.

```bash
SITE_ORIGIN=https://www.classific.example
CONTACT_ENDPOINT=
```

## Commands

| Command | Purpose |
| --- | --- |
| `bun run dev` | Vite development server |
| `bun run build` | Production build: OG images, SEO files, client bundle, prerender |
| `bun run preview` | Preview the `dist` folder |
| `bun run lint` | ESLint |
| `bun run typecheck` | TypeScript |
| `bun run test` | Vitest |
| `bun run test:coverage` | Vitest with coverage thresholds |
| `bun run test:e2e` | Playwright against the production preview |
| `bun run seo:generate` | Write `robots.txt`, `sitemap.xml`, `llms.txt`, and `llms-full.txt` |
| `bun run check` | Typecheck, lint, coverage, production build, and e2e |

`bun run check` and `bun run build` fail if `SITE_ORIGIN` is missing, is localhost, or is not an absolute `https` origin.

## Environment variables

- **`SITE_ORIGIN`** — Canonical origin used in canonical URLs, Open Graph tags, the sitemap, robots, and llms files. Example: `https://www.classific.example`.
- **`CONTACT_ENDPOINT`** — Absolute URL that accepts a JSON project enquiry. When unset, the form validates locally and tells the visitor the enquiry channel is not connected. It never reports that a message was sent.

No secrets belong in the client bundle. Do not put API keys in these variables.

## How SEO files are generated

`bun run build` runs three generators after validating `SITE_ORIGIN`:

1. `scripts/render-og.mjs` rasterizes the brand SVG to `public/og/classific-og.png` (1200×630) and stamps a title for each service and published article or project.
2. `scripts/generate-seo.mjs` writes `robots.txt`, `sitemap.xml`, `llms.txt`, and `llms-full.txt` from the same TypeScript content modules the router uses.
3. `scripts/prerender.mjs` renders every public route to `dist/<path>/index.html` and writes `dist/404.html`.

The sitemap lists home, services, the five service URLs, work, process, about, insights, published articles, published projects, contact, privacy, and terms. Drafts, placeholders, 404, and query variants are excluded. `lastmod` is written only when a record has a date.

JSON-LD is limited to facts that exist in the content modules: `Organization` and `WebSite` without address, phone, or `sameAs`; `Service` on service pages; `BreadcrumbList` on inner pages; `Article` on published essays. Ratings and reviews are never emitted.

## Deployment

The production output is a static site in `dist`. Deploy that folder to any host that can:

- Serve `index.html` for prerendered directories
- Serve `404.html` for unknown paths
- Keep `robots.txt`, `sitemap.xml`, `llms.txt`, `llms-full.txt`, and `og/` at the site root

Set `SITE_ORIGIN` to the public https origin before building. If you later connect an enquiry backend, set `CONTACT_ENDPOINT` to that URL at build time.

## Adding content

Edit the typed modules in `src/data`. Do not add a new page component for a new service, project, or article.

- **Service** — add an object to `src/data/services.ts` with a unique slug. The route table, sitemap, and service pages pick it up.
- **Project** — add an object to `src/data/projects.ts`. Only records with `status: "published"` appear in the UI, sitemap, or llms files. Leave outcomes empty unless they are verified.
- **Article** — add an object to `src/data/insights.ts`. Unpublished drafts stay out of the UI and SEO files.

Contact details and social profiles live in `src/data/site.ts`. Empty values are omitted from the footer and structured data.

## Design and conventions

Four-space indentation is enforced by Prettier. Presentation stays in `.tsx` files; behaviour lives in sibling `.hooks.ts` files. Sometic provides the form, overlay, accordion, breadcrumb, and HTTP primitives. Tokens come from `src/styles/tokens.css` and `src/styles/global.css`.
