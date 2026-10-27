# Cursor Master Prompt: Classific Website

## Production-Grade Software Engineering Company Website

You are a senior product designer, frontend architect, React engineer, accessibility specialist, SEO engineer, and QA engineer working on **Classific**, a professional software engineering and digital product development company.

Your task is to build the complete, production-ready Classific website, following the existing design references and design system. Do not create a generic agency template, dashboard, or AI-generated-looking landing page.

**This is an implementation task, not a planning-only task.** Inspect the repository, understand the available tools and existing design assets, implement the website, run the tests, fix issues, and leave the project in a working state.

---

# 1. Core Objectives

Build a website that communicates the following positioning:

**Classific builds software for real business challenges.**

Classific provides:

1. Web application development.
2. Mobile application development.
3. Desktop application development.
4. CRM, CMS, and ERP systems.
5. Custom software solutions.
6. SaaS platforms and digital product engineering.
7. API development and system integrations, where appropriate to the company's actual service offering.

The website must communicate engineering competence, design maturity, business understanding, reliability, and professionalism.

The intended audience includes business owners, founders, startups, growing companies, and established organizations seeking software development services.

The website should feel like a sophisticated digital product engineering studio, not a traditional IT outsourcing agency.

## Primary conversion goals

- Encourage prospective clients to initiate a project.
- Demonstrate the services Classific provides.
- Showcase relevant projects and engineering capabilities.
- Explain the company's working process.
- Establish credibility through genuine evidence.
- Make it easy to contact Classific.

Never fabricate client logos, testimonials, project outcomes, statistics, certifications, or company history. Use clearly identified placeholders where verified content is unavailable.

---

# 2. Mandatory Technology Stack

Use the following stack:

- Vite.
- React.
- TypeScript.
- Tailwind CSS.
- Sometic: https://sometic.dev/
- Vitest for unit and component tests.
- React Testing Library for component tests.
- Playwright for end-to-end tests.
- ESLint and Prettier, configured consistently.
- Bun as the package manager, unless the existing repository already has an established package-manager configuration that must be preserved.

Use stable, compatible versions and follow the existing project's configuration where appropriate.

## 2.1 Sometic integration is mandatory

Sometic is the preferred foundation for shared utilities, HTTPS-related functionality, query handling, storage, UI primitives, and other capabilities it officially supports.

Before implementing the application:

1. Inspect https://sometic.dev/ and its available documentation.
2. Inspect the existing repository's `package.json`, lockfile, installed packages, and Sometic configuration.
3. Identify the actual Sometic packages, APIs, hooks, utilities, and components available to this project.
4. Review the relevant source code, types, and usage examples where available.
5. Use Sometic's supported APIs rather than inventing imports, methods, component names, or configuration options.
6. Prefer Sometic primitives when they fit the requirements and can be styled according to the Classific design system.

Sometic's default unstyled components should be customized through our design tokens and Tailwind styles.

**Do not replace Sometic with unrelated libraries for capabilities it already provides.** Conversely, do not force Sometic into areas it does not support. If a capability is unavailable, select a small, well-maintained alternative and document the decision.

Do not assume that a Sometic package exists merely because a particular API would be convenient.

---

# 3. Mandatory Coding Conventions

These rules apply to every source file.

## 3.1 Four-space indentation

Use exactly four spaces for each indentation level throughout TypeScript, TSX, CSS, JSON, configuration files, tests, and other editable source files wherever applicable.

Configure Prettier and ESLint to enforce the convention.

Do not use tabs.

## 3.2 JSX-only presentation components

All React pages and UI components must be implemented in `.tsx` files and contain presentation-layer code only.

The `.tsx` extension is required because these are TypeScript files containing JSX.

A component may contain:

- Typed props.
- JSX markup.
- Semantic HTML.
- Tailwind classes.
- Presentation-specific conditional rendering.
- Imported hooks and callbacks.
- Small, purely presentational formatting operations.

A component must not own application business logic, API orchestration, complex calculations, data persistence, or substantial state management.

Keep components small, composable, readable, and reusable.

## 3.3 Separate hooks from components

Every page and every stateful or behavior-bearing component must have a corresponding hook file.

Example:

```text
src/
    components/
        layout/
            SiteHeader.tsx
            SiteHeader.hooks.ts
            SiteFooter.tsx
            SiteFooter.hooks.ts
        services/
            ServiceCard.tsx
            ServiceCard.hooks.ts
    pages/
        HomePage.tsx
        HomePage.hooks.ts
        ServicesPage.tsx
        ServicesPage.hooks.ts
```

The `.hooks.ts` file must contain the associated state, event handlers, effects, derived values, and logical behavior.

The component should consume the hook and render the resulting view model.

Example:

```tsx
import { useHomePage } from "./HomePage.hooks";

export function HomePage() {
  const { services, featuredProjects, handleProjectInquiry } = useHomePage();

  return <main>{/* Presentation only */}</main>;
}
```

The example is illustrative. Implement real components with complete markup and functionality.

### Hook requirements

- Follow React's Rules of Hooks.
- Use descriptive, feature-specific hook names.
- Avoid creating hooks that merely wrap a single trivial constant without a clear benefit.
- Keep network operations, state transitions, storage operations, and business rules outside presentation components.
- Do not use effects to derive values that can be computed directly.
- Clean up subscriptions, listeners, observers, and other resources.
- Avoid stale closures and unnecessary rerenders.
- Keep hook dependencies correct.
- Use typed return values where they improve clarity.

For a purely static decorative component, a separate hook may return nothing useful. Do not introduce meaningless hooks solely to satisfy a file naming convention.

## 3.4 Architecture and maintainability

- Use TypeScript strict mode.
- Avoid `any`, unsafe casts, and unexplained type suppression.
- Avoid circular dependencies.
- Avoid giant components and monolithic hooks.
- Avoid duplicated business logic.
- Separate domain models, service functions, hooks, components, pages, and configuration.
- Prefer named exports, unless a framework or library convention requires otherwise.
- Use explicit types for API responses, form inputs, and important domain models.
- Keep configuration centralized.
- Never put secrets or private API credentials in frontend environment variables.
- Do not add unnecessary dependencies.

---

# 4. Design System: Classific

The existing Classific design system and approved visual references are the source of truth.

Before writing UI code, locate and inspect the design system assets and documentation in the repository. If the assets are provided separately, import or copy them into the project while preserving their original filenames where practical.

Use these design tokens as the initial baseline, adjusting only when the approved design assets specify different values.

## 4.1 Visual identity

The visual direction is:

**Minimal editorial. Architectural. Typography-led. Precise. Professional.**

The site must have:

- Strong typography.
- Generous, intentional whitespace.
- Precise alignment.
- Thin dividers.
- Restrained borders.
- Clear visual hierarchy.
- Neutral architectural imagery.
- Authentic product interface imagery.
- Subtle, purposeful interactions.
- Consistent spacing across every section and breakpoint.

The site must not resemble a template generated by an AI website builder.

### Explicitly avoid

- Glowing blue gradients.
- Oversized glossy 3D blobs.
- Floating decorative spheres and cubes.
- Excessive glassmorphism.
- Random floating cards.
- Unnecessary rounded-card grids.
- Excessive pill-shaped UI.
- Huge decorative background typography without purpose.
- Fake dashboard mockups presented as real projects.
- Generic stock photographs of people shaking hands.
- Excessive animations and parallax.
- Arbitrary spacing differences between sections.
- Decorative effects that compete with the content.
- Repetitive layouts where every section uses the same composition.

Do not introduce these elements merely to make the site appear more visually impressive.

## 4.2 Color tokens

```css
:root {
  --color-ink: #111315;
  --color-ink-soft: #25282b;
  --color-body: #62666b;
  --color-muted: #85898d;
  --color-rule: #e5e5e2;
  --color-paper: #f7f7f4;
  --color-white: #ffffff;
  --color-accent: #245bdb;
  --color-accent-tint: #eaf0ff;
}
```

Usage:

- `--color-ink`: headings, primary text, primary buttons.
- `--color-body`: body copy.
- `--color-muted`: secondary metadata and captions.
- `--color-rule`: borders and dividers.
- `--color-paper`: page backgrounds.
- `--color-white`: content surfaces.
- `--color-accent`: restrained links and selected emphasis.
- `--color-accent-tint`: rare highlighted areas.

Keep approximately 90% of the visual experience neutral. Accent colors must serve a functional or clearly intentional purpose.

## 4.3 Typography

Use Inter or Geist Sans, depending on the available fonts and the approved design assets.

Use responsive typography with `clamp()`.

Initial scale:

| Style      | Desktop | Mobile |
| ---------- | ------: | -----: |
| Display    |    72px |   44px |
| H1         |    60px |   40px |
| H2         |    42px |   32px |
| H3         |    24px |   21px |
| Body large |    18px |   17px |
| Body       |    16px |   15px |
| Small      |    13px |   13px |
| Eyebrow    |    11px |   10px |

Use restrained font weights. Typography and spacing should create the hierarchy rather than excessive boldness.

Headlines should be concise, intentionally line-broken, and easy to scan.

## 4.4 Spacing

Use a four-pixel base spacing scale:

```text
4, 8, 12, 16, 24, 32, 48, 64, 80, 96, 120, 160
```

Desktop gutters: 48–64px.

Tablet gutters: 32px.

Mobile gutters: 20–24px.

Section spacing: approximately 88–128px on desktop and 56–80px on mobile, adjusted to content density.

Use a consistent grid throughout the website. Do not add arbitrary padding to individual sections.

## 4.5 Components

Buttons, links, form controls, navigation, service listings, project previews, and other components must share consistent styles.

Prefer:

- Square or subtly rounded corners.
- Thin, low-contrast borders.
- Strong text hierarchy.
- Underlined text links or small directional arrows.
- Open layouts separated by rules.
- Simple transitions.
- Clear focus states.

Use cards only where grouping content genuinely improves comprehension.

## 4.6 Tailwind integration

Translate the design tokens into reusable Tailwind theme values or CSS variables.

Avoid repeating arbitrary hex colors and one-off spacing values throughout the codebase.

Create reusable utilities or component classes only where they improve consistency.

Do not build an unnecessarily elaborate design-token framework.

---

# 5. Required Website Pages

Implement the following routes with a consistent shared layout.

## 5.1 Home `/`

The homepage must tell a complete story.

### Section A: Header

- Classific wordmark.
- Services.
- Work.
- Process.
- About.
- Insights.
- Primary “Start a Project” CTA.
- Accessible mobile navigation.

Use a clean horizontal navigation on desktop.

The mobile menu must support keyboard navigation, proper focus handling, Escape-to-close behavior, and appropriate ARIA attributes.

### Section B: Hero

Suggested headline:

**Software for what's next.**

Suggested supporting copy:

“We design and build web, mobile, desktop, and enterprise software that helps businesses move faster, work smarter, and grow with confidence.”

Primary CTA: Start a Project.

Secondary CTA: See Our Work.

Use an architectural image or subtle architectural composition that follows the approved visual reference.

The hero should feel spacious and editorial, with large typography and a carefully balanced image.

Avoid a conventional centered hero with a gradient background and three floating interface cards.

### Section C: Credibility strip

Show verified company metrics only.

If no verified metrics are available, use a capabilities strip or another meaningful proof section rather than inventing numbers.

### Section D: Services

Show five principal service categories:

1. Web Applications.
2. Mobile Applications.
3. Desktop Applications.
4. CRM, CMS & ERP.
5. Custom Software Solutions.

Each service should have:

- A concise title.
- A meaningful description.
- A restrained icon or typographic identifier.
- A link to the relevant service page.

Use a structured editorial grid with consistent alignment and spacing.

### Section E: Process

Present a clear five-step process:

1. Discover.
2. Plan.
3. Design.
4. Develop.
5. Launch.

Explain each stage briefly.

Use thin rules, numbered steps, and a clear reading sequence. Do not create an oversized decorative process timeline.

### Section F: Why Classific

Explain the company's working principles:

- Business-focused engineering.
- Modern technology.
- Long-term partnership.
- Dependable support.

Use clear typography and an asymmetric layout if appropriate.

### Section G: Featured work

Create reusable project components.

Each project should support:

- Title.
- Category.
- Description.
- Image.
- Technologies, when relevant.
- Project URL, when available.
- Outcomes, only when verified.

Use authentic imagery from approved assets.

Never fabricate client work. Clearly mark placeholder projects in development data until replaced.

### Section H: Client proof

Support real client logos, testimonials, and case-study evidence.

If approved material is unavailable, omit this section or use a neutral credibility section. Do not publish fabricated endorsements.

### Section I: Closing CTA

Suggested headline:

**Let's build what's next.**

Include a short supporting paragraph and a clear project enquiry action.

Use a dark, restrained treatment consistent with the reference, without decorative 3D elements.

### Section J: Footer

Include:

- Classific wordmark.
- Short company description.
- Service navigation.
- Company navigation.
- Contact information.
- Social links where verified.
- Privacy policy.
- Terms of service.
- Copyright.

Do not invent phone numbers, email addresses, social URLs, or physical addresses.

## 5.2 Services `/services`

Create a comprehensive service overview page with:

- Editorial introduction.
- Service listings.
- Business problems addressed.
- Typical deliverables.
- Development approach.
- CTA.

Service data should be maintained centrally and rendered dynamically.

## 5.3 Individual service pages

Implement reusable page templates for:

- `/services/web-applications`
- `/services/mobile-applications`
- `/services/desktop-applications`
- `/services/crm-cms-erp`
- `/services/custom-software`

Each page should have a distinct, relevant narrative rather than duplicating the same generic content.

Include:

- Service-specific hero.
- Problems solved.
- Relevant capabilities.
- Example use cases.
- Development process.
- Related projects, if available.
- FAQs.
- CTA.

Use route data and shared components instead of duplicating page structures.

## 5.4 Work `/work`

Build a portfolio overview with a reusable project grid.

Support project categories and filtering when there is enough actual content to justify the feature.

Include meaningful empty states and accessible filter controls.

## 5.5 Individual project pages

Use a reusable case-study template where project details are available.

Potential route pattern:

`/work/:slug`

Each case study should support:

- Project overview.
- Business challenge.
- Approach.
- Solution.
- Screenshots or imagery.
- Technology details.
- Verified outcomes.
- Related projects.
- Contact CTA.

Do not create fake case studies to populate the site.

## 5.6 Process `/process`

Explain how Classific works from discovery to launch and ongoing support.

Include project stages, collaboration expectations, and deliverables.

Do not promise fixed timelines or guaranteed outcomes without approved business information.

## 5.7 About `/about`

Explain Classific's positioning, engineering philosophy, and approach to partnerships.

Do not invent employee biographies, founding dates, awards, company size, or company history.

## 5.8 Insights `/insights`

Create a scalable blog and insights listing.

Each article should support:

- Title.
- Slug.
- Excerpt.
- Cover image.
- Publication date.
- Updated date, if applicable.
- Author, if verified.
- Categories.
- Reading time.
- Article body.
- Related articles.
- Social sharing metadata.

Implement individual article routes.

Keep content structured so new articles can be added without modifying the layout components.

## 5.9 Contact `/contact`

Create an accessible project enquiry form.

Suggested fields:

- Name.
- Business email.
- Company, optional.
- Service interest.
- Estimated budget, optional.
- Project description.
- Privacy acknowledgement, if legally appropriate.

Requirements:

- Typed form model.
- Client-side validation.
- Server-side validation when a backend exists.
- Clear loading, success, and error states.
- Accessible labels and validation messages.
- Spam protection appropriate to the deployment.
- No fake success responses.
- No silent form submissions.

If no backend or form provider is configured, make the integration boundary explicit and provide a safe development fallback.

Do not claim that a message was delivered unless the server confirms success.

## 5.10 Legal pages

Implement:

- `/privacy`
- `/terms`

Create professionally structured drafts and clearly identify any legal information that requires review.

Do not represent placeholder legal copy as reviewed legal advice.

---

# 6. Dynamic and Data-Driven Architecture

The website must be component-driven and data-driven.

Do not hardcode repeated services, projects, navigation entries, article cards, FAQs, or metadata into individual pages.

Use typed data models and reusable rendering components.

Example structure:

```text
src/
    app/
        App.tsx
        router.tsx
    components/
        layout/
        navigation/
        ui/
        services/
        projects/
        insights/
        forms/
        seo/
    pages/
        home/
        services/
        work/
        process/
        about/
        insights/
        contact/
        legal/
        not-found/
    hooks/
        shared/
    data/
        navigation.ts
        services.ts
        projects.ts
        process.ts
        insights.ts
        faqs.ts
    lib/
        seo/
        validation/
        formatting/
    services/
        contact/
        content/
    types/
    styles/
    test/
```

Adapt this structure if the existing repository has a better established architecture.

Keep hooks beside their associated page or component when that makes ownership clear. The shared hooks directory should contain only genuinely shared hooks.

### Requirements

- Use typed route configuration.
- Generate service pages from shared data.
- Generate project and article routes from structured content.
- Centralize repeated content.
- Use stable keys.
- Avoid deeply nested conditional rendering.
- Keep UI components independent of storage and networking details.
- Separate external service integrations from React rendering.
- Use a consistent not-found experience.
- Ensure links remain valid when content is added or removed.

Use the routing library already present in the repository if suitable. Otherwise, select a stable, lightweight solution compatible with Vite and React.

---

# 7. SEO: Complete Technical Implementation

SEO is a required feature, not a final cosmetic task.

Implement technical SEO across every indexable page.

## 7.1 Metadata

Create a reusable SEO hook or metadata component using the supported React APIs and the selected routing solution.

Every route must support unique:

- Page title.
- Meta description.
- Canonical URL.
- Open Graph title.
- Open Graph description.
- Open Graph image.
- Open Graph URL.
- Open Graph type.
- Twitter/X card metadata.
- Robots directives where needed.

Use an explicit, configurable production site origin.

Do not use localhost or staging URLs in production metadata.

Do not use identical metadata for every service page.

## 7.2 Server rendering and SPA considerations

Vite normally produces a client-rendered application unless additional rendering infrastructure is configured.

Evaluate whether static prerendering or server-side rendering is appropriate for this marketing website.

Prefer a solution that makes the primary page content and metadata available to search engines and social crawlers without relying exclusively on client-side JavaScript.

If using prerendering:

- Generate all known static routes at build time.
- Generate individual service, project, and article pages.
- Ensure the correct page-specific metadata is present in generated HTML.
- Keep dynamic content and unknown routes safe.
- Avoid introducing an unnecessarily complex server architecture.

Do not claim that a client-side metadata update alone guarantees correct social crawler previews.

## 7.3 Open Graph image creation

Create a dedicated, professional Classific Open Graph image.

Requirements:

- Preferred size: 1200 × 630 pixels.
- Format: PNG or JPEG.
- Filename: `/og/classific-og.png`, or an equivalent documented public path.
- Use the Classific wordmark, neutral palette, restrained typography, and architectural art direction.
- Keep the composition legible at social-preview size.
- Avoid generic gradients, glossy 3D objects, and clutter.
- Include an appropriate title or brand message.
- Use accessible and meaningful metadata.

If the repository contains approved logo and imagery assets, use those.

Otherwise, create the image using SVG or a deterministic image-generation script so it can be regenerated consistently.

Generate a default social image and support custom OG images for important service, project, and article pages where appropriate.

Verify that the final image exists and that metadata references the correct production URL.

## 7.4 robots.txt

Generate `/robots.txt` in the production public output.

Requirements:

- Allow crawling of intended public pages.
- Reference the production sitemap URL.
- Avoid exposing private or sensitive endpoints unnecessarily.
- Do not accidentally block CSS, JavaScript, or important public assets.
- Do not use robots.txt as a substitute for authentication or access control.

Use a configurable production origin.

## 7.5 Sitemap generation

Generate `/sitemap.xml` during the production build.

Include all intended canonical, indexable pages, including:

- Home.
- Services overview.
- Individual service pages.
- Work overview.
- Published project pages.
- Process.
- About.
- Insights overview.
- Published articles.
- Contact.
- Approved legal pages, if intended to be indexed.

Exclude:

- 404 pages.
- Internal routes.
- Development routes.
- Draft articles.
- Duplicate URLs.
- Private pages.
- Query-string variants that should not be indexed.

Use absolute canonical URLs.

Use accurate `lastmod` values only when the relevant content dates are available.

Validate the generated XML.

The build must fail if sitemap generation fails or produces invalid output.

## 7.6 llms.txt and full llms files

Generate both:

- `/llms.txt`
- `/llms-full.txt`

Treat these as machine-readable content discovery and documentation resources, not as guaranteed SEO ranking factors.

### `llms.txt`

Create a concise, structured overview containing:

- Classific's name.
- A verified description of the company.
- Services.
- Primary public pages.
- Work and case-study links.
- Contact information.
- Links to important public content.
- Relevant additional resources.

### `llms-full.txt`

Create a more comprehensive plain-text representation of the publicly available website content.

Include:

- Company overview.
- Service descriptions.
- Service page URLs.
- Development process.
- Verified company information.
- Published case studies.
- Published insights and articles.
- Public contact information.
- Relevant FAQs.
- Canonical URLs where useful.

Requirements:

1. Generate these files from the same structured content sources used by the website wherever possible.
2. Avoid maintaining contradictory copies of page content.
3. Exclude drafts and unpublished content.
4. Exclude personal information, credentials, private configuration, and internal documentation.
5. Never invent services, client results, company facts, or legal claims.
6. Use UTF-8 plain text.
7. Include absolute production URLs.
8. Use consistent Markdown-style headings and links.
9. Regenerate these files as part of the production build.
10. Add tests to ensure the generated files exist and include the expected public routes.

Do not merely create empty placeholder files named `llms.txt`.

## 7.7 Structured data

Implement valid JSON-LD for applicable entities, such as:

- `Organization`.
- `WebSite`.
- `Service`.
- `BreadcrumbList`.
- `Article` for published insights.

Use only facts supported by actual content.

Use canonical URLs and accurate image URLs.

Do not fabricate ratings, reviews, addresses, or other properties.

Validate JSON-LD syntax and test the generated structured data.

## 7.8 SEO content quality

Each indexable route must have:

- One meaningful primary heading.
- Logical heading hierarchy.
- Unique metadata.
- Useful original content.
- Appropriate internal links.
- Correct canonical URL.
- Appropriate image alternative text.
- Crawlable links.
- No accidental `noindex` directive.

Avoid keyword stuffing, duplicate service-page content, and generic filler.

---

# 8. Responsive Design: Every Breakpoint

The website must work at all practical viewport sizes.

Test at a minimum:

- 320px.
- 360px.
- 390px.
- 430px.
- 768px.
- 1024px.
- 1280px.
- 1440px.
- 1920px.

Requirements:

- No unintended horizontal overflow.
- No overlapping text.
- No clipped CTAs.
- No broken grid layouts.
- No unreadable typography.
- No navigation collisions.
- No images with distorted aspect ratios.
- No inaccessible mobile menus.
- No fixed-height sections that clip content.
- No desktop-only hover interactions that make mobile content inaccessible.

Use fluid sizing, responsive grids, suitable breakpoints, and `clamp()` where appropriate.

Design the mobile experience intentionally rather than shrinking the desktop page.

Check both portrait and landscape layouts where relevant.

---

# 9. Accessibility

Target WCAG 2.2 AA where applicable.

Implement:

- Semantic HTML.
- Correct heading hierarchy.
- Keyboard navigation.
- Visible focus indicators.
- Accessible menus and dialogs.
- Form labels and accessible validation messages.
- Meaningful image alt text.
- Appropriate decorative-image handling.
- Sufficient text and interface contrast.
- Reduced-motion support.
- Accessible link names.
- Appropriate ARIA attributes only when necessary.
- Correct focus management for interactive elements.

Do not use clickable `div` elements when semantic buttons or links are appropriate.

Do not rely on color alone to convey state.

Include automated accessibility checks in the E2E suite where feasible, but do not treat automated checks as proof of complete accessibility.

---

# 10. Performance

Optimize for Core Web Vitals and perceived loading speed.

Requirements:

- Keep JavaScript bundles reasonable.
- Lazy-load appropriate below-the-fold imagery.
- Prioritize the hero image when necessary.
- Use responsive images.
- Prefer AVIF or WebP for photographic assets.
- Use SVG for logos and icons.
- Specify image dimensions or aspect ratios.
- Avoid layout shifts.
- Avoid unnecessary animation libraries.
- Avoid large third-party scripts.
- Split code where it materially improves loading.
- Use production builds for performance validation.
- Respect browser caching and deployment capabilities.

Do not lazy-load the primary hero image when doing so would delay the largest contentful paint.

Set performance budgets and investigate regressions instead of hiding them.

Use Lighthouse or an equivalent tool to assess representative routes.

Target strong Core Web Vitals, but do not claim a perfect score without measuring the built application under documented test conditions.

---

# 11. Unit and Component Testing

Use Vitest and React Testing Library.

All significant logic must have automated tests.

Test:

- Shared hooks.
- Service-data transformations.
- Route generation.
- SEO metadata generation.
- Sitemap generation.
- llms file generation.
- Form validation.
- Error states.
- Empty states.
- Navigation behavior.
- Responsive menu logic.
- Project filtering.
- Article formatting utilities.
- Reusable interactive components.

### Testing requirements

- Use realistic typed test data.
- Test both success and failure cases.
- Test edge cases.
- Avoid brittle implementation-detail assertions.
- Avoid snapshots as the only evidence of correctness.
- Mock external services at their boundaries.
- Keep tests deterministic.
- Do not require live third-party services for normal unit-test execution.

Use meaningful coverage thresholds for application logic and critical functionality.

Aim for at least 80% coverage of testable application logic as an initial project threshold. Require 100% coverage for specifically identified critical pure utilities when practical, and explain any exclusions.

Do not claim that the entire application has 100% test coverage unless the actual coverage report confirms it.

---

# 12. Playwright End-to-End Testing

Implement a complete Playwright E2E suite.

Use a dedicated Playwright configuration and documented scripts.

The suite must cover:

## Navigation

- Homepage loads.
- Header navigation works.
- Mobile menu opens and closes.
- Keyboard interactions work.
- Unknown routes show the correct not-found page.
- Internal links resolve correctly.

## Service pages

- All service routes render.
- Page titles and descriptions are present.
- Related service links work.
- CTAs navigate to the intended destination.

## Portfolio

- Work overview renders.
- Project cards link correctly.
- Filtering works when implemented.
- Project detail routes render.
- Missing projects are handled safely.

## Insights

- Article listing renders.
- Published article routes work.
- Article metadata is correct.
- Draft content is not publicly exposed.
- Missing article routes are handled safely.

## Contact form

- Required fields validate.
- Invalid email addresses are rejected.
- Error messages are accessible.
- Valid submissions reach the configured integration.
- Loading and success states behave correctly.
- Failed submissions show useful error messages.
- No false success state is displayed.

Use a mock or test-only endpoint when the real submission provider is unavailable.

## SEO

- Every important route has the correct title and description.
- Canonical URLs are correct.
- Open Graph metadata is present.
- Social image URLs resolve.
- robots.txt exists.
- sitemap.xml exists and contains valid URLs.
- llms.txt and llms-full.txt exist.
- JSON-LD is valid.
- No production metadata points to localhost.

## Responsive and accessibility smoke tests

Test at mobile, tablet, and desktop widths.

Check for horizontal overflow and major layout failures.

Add accessibility assertions for key flows.

Use stable selectors and accessible roles instead of fragile CSS selectors wherever possible.

Capture screenshots on failures.

Run tests against the production build or a production-like preview server when appropriate.

---

# 13. Design Asset Management

Inspect all existing design assets before creating new ones.

Prioritize approved Classific assets and the existing design system.

Organize assets clearly:

```text
public/
    favicon.svg
    robots.txt
    sitemap.xml
    llms.txt
    llms-full.txt
    og/
        classific-og.png
    images/
        architecture/
        services/
        projects/
        insights/
```

Adapt this structure if the repository already has a sensible asset convention.

Requirements:

- Reuse approved SVG icons.
- Reuse the Classific wordmark.
- Use the existing architectural imagery references.
- Preserve the minimal editorial direction.
- Avoid using full-page design mockups as individual section images.
- Avoid cropping reference screenshots to pretend they are individual original assets.
- Create or obtain individual assets for the actual website.
- Use descriptive filenames.
- Use meaningful alt text for informative images.
- Mark decorative images appropriately.
- Keep asset sizes optimized.

If an image is only a visual reference and is not suitable for production, replace it with a properly prepared asset rather than shipping a poor crop.

Do not invent external image URLs or rely on remote assets that may disappear.

---

# 14. Functional Requirements

All visible controls must work.

Implement real behavior for:

- Desktop navigation.
- Mobile navigation.
- Service links.
- Project links.
- Article links.
- Primary and secondary CTAs.
- Contact form.
- Project enquiry flow.
- Filtering controls, if present.
- Newsletter signup, only if an actual backend or provider is configured.
- Cookie or privacy controls, if required by the actual deployment.
- Any interactive accordions, dialogs, or menus.

Do not ship dead buttons, placeholder `href="#"` links, fake search fields, or decorative controls that appear functional but do nothing.

Where an external integration is not configured, provide an explicit integration boundary and a clear, honest fallback.

---

# 15. Security and Reliability

- Never commit credentials.
- Keep private secrets out of frontend bundles.
- Validate external inputs.
- Validate contact submissions server-side when a backend is available.
- Avoid unsafe HTML injection.
- Sanitize untrusted content where required.
- Use safe URL handling.
- Avoid unnecessary storage of personal information.
- Keep dependencies maintained.
- Check for dependency vulnerabilities.
- Avoid unnecessary permissions.
- Document required production environment variables.
- Do not expose unpublished content through generated SEO files.

If the project requires backend capabilities not present in the repository, document and isolate that integration rather than pretending a frontend-only implementation provides server-side security.

---

# 16. Developer Experience and Scripts

Configure clear, repeatable scripts for:

- Development server.
- Production build.
- Preview.
- Lint.
- Type checking.
- Unit tests.
- Unit tests with coverage.
- Playwright E2E.
- Playwright UI mode, if useful.
- SEO artifact generation.
- Full CI validation.

Use Bun commands when the project uses Bun.

Example script names:

```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "lint": "eslint .",
    "typecheck": "tsc --noEmit",
    "test": "vitest run",
    "test:watch": "vitest",
    "test:coverage": "vitest run --coverage",
    "test:e2e": "playwright test",
    "seo:generate": "node scripts/generate-seo.mjs",
    "check": "run-all-validation-tasks"
  }
}
```

This is a conceptual script map. Adapt it to the actual tools, package scripts, and execution order. Do not create a fake `run-all-validation-tasks` command; implement the real command or use a small script that runs the necessary checks.

Do not duplicate existing scripts unnecessarily.

Add appropriate Git ignore rules and ensure generated build artifacts are handled consistently.

---

# 17. Continuous Integration

If the repository uses GitHub Actions, implement or update CI to run:

1. Dependency installation using the established lockfile.
2. Lint.
3. Type checking.
4. Unit tests.
5. Coverage checks.
6. Production build, including SEO artifact generation.
7. Sitemap and metadata validation.
8. Playwright E2E tests.

Install required Playwright browsers in CI.

Use deterministic dependency installation.

Do not weaken tests or disable lint rules simply to obtain a green build.

If no CI configuration exists, add a straightforward workflow that matches the repository's package manager and project structure.

---

# 18. Implementation Workflow

Follow these phases in order.

## Phase 1: Repository inspection

Inspect:

- Project structure.
- Package configuration.
- Existing dependencies.
- Sometic documentation and installed APIs.
- Tailwind configuration.
- Existing Classific design assets.
- Existing design tokens.
- Existing routing.
- Existing tests.
- Existing SEO setup.
- Build and deployment configuration.

Do not overwrite useful existing work without understanding it.

## Phase 2: Architecture and design tokens

Establish:

- Theme tokens.
- Typography.
- Spacing.
- Layout primitives.
- Button styles.
- Navigation.
- Responsive grid behavior.
- Asset organization.
- Shared page layout.

Ensure all visual components follow the same design system.

## Phase 3: Core implementation

Build the shared header, footer, routing, homepage, services, work, process, about, insights, contact, and legal pages.

Prioritize the homepage and shared components, then implement all remaining routes.

Do not stop after producing the homepage mockup.

## Phase 4: Data and dynamic components

Create typed service, project, navigation, FAQ, and article models.

Connect shared components to structured data.

Ensure new services, projects, and articles can be added without duplicating page components.

## Phase 5: SEO and assets

Implement the metadata system, OG image, robots.txt, sitemap.xml, llms.txt, llms-full.txt, and applicable structured data.

Generate the artifacts during the production build.

Validate that all generated URLs and files are correct.

## Phase 6: Unit tests

Test hooks, data logic, validation, SEO generation, and key components.

Fix failures before moving on.

## Phase 7: Playwright E2E

Implement and run the complete critical user-flow suite.

Test the built application and verify responsive layouts.

## Phase 8: Final QA

Run lint, type checking, unit tests, coverage, build, SEO validation, and E2E tests.

Fix all implementation issues found.

Review the site visually at every required breakpoint.

Remove unused assets, dead code, placeholder interactions, and accidental console errors.

---

# 19. Definition of Done

The project is complete only when all of the following are satisfied.

### Design

- The website follows the approved Classific design system.
- The design is minimal, clean, and editorial.
- Typography and whitespace are consistent.
- The site has no generic AI-generated visual styling.
- All key pages are implemented.
- All layouts work across the required breakpoints.

### Architecture

- Vite, React, TypeScript, and Tailwind CSS are configured correctly.
- Sometic is used where its documented capabilities are appropriate.
- UI components remain presentation-focused.
- Hooks and logic are separated.
- Repeated content is data-driven.
- No circular dependencies are introduced.
- Four-space indentation is consistently enforced.

### Functionality

- All visible controls work.
- Forms validate and handle failures correctly.
- Navigation and routing work.
- No dead links or fake interactions remain.

### SEO

- Page-specific metadata is implemented.
- Open Graph image exists and is correctly referenced.
- robots.txt is generated.
- sitemap.xml is generated and validated.
- llms.txt is generated.
- llms-full.txt is generated.
- JSON-LD is valid.
- Canonical URLs use the production origin.

### Quality

- Unit tests pass.
- Coverage requirements pass.
- Playwright E2E tests pass.
- Lint passes.
- Type checking passes.
- Production build passes.
- Responsive QA is complete.
- Accessibility issues identified during testing are addressed.
- No unexplained runtime errors remain.

### Documentation

Provide a README containing:

- Installation instructions.
- Package-manager instructions.
- Development commands.
- Build instructions.
- Testing instructions.
- E2E setup.
- Environment variable documentation.
- SEO generation behavior.
- Deployment considerations.
- Instructions for adding services, projects, and articles.

---

# 20. Final Instructions to Cursor

Begin by inspecting the actual repository and available Classific assets.

Use the approved design references and design system as the visual source of truth.

Do not replace the design with your own interpretation that introduces unnecessary visual effects.

Do not fabricate business information or portfolio content.

Do not invent Sometic APIs.

Do not stop after producing a plan, wireframe, homepage, or partial implementation.

Implement the complete website, generate the SEO artifacts, write the tests, run the checks, and fix the issues.

If a required integration depends on unavailable credentials or external infrastructure, implement the appropriate integration boundary, clearly document what remains, and never claim it is operational when it is not.

At completion, provide a concise engineering report containing:

1. Pages and features implemented.
2. Architecture and important design decisions.
3. Sometic capabilities used and any justified alternatives.
4. Generated SEO files and OG assets.
5. Unit-test results and coverage percentage.
6. Playwright E2E results.
7. Lint, type-check, and production-build results.
8. Responsive and accessibility validation performed.
9. Any remaining external configuration or content requirements.

**Final standard:** Classific must look and behave like a professionally designed and engineered software company's website, with a distinctive visual identity, production-quality implementation, maintainable architecture, comprehensive SEO, and verifiable automated tests.
