# Classific Design System Guide
Version 1.0 | Minimal editorial, architectural, typography-led

## Brand principle
Digital products. Real business impact. Use clarity, precise grids, confident typography, real product evidence, and whitespace. Avoid decorative gradients, generic 3D blobs, excessive cards, and artificial-looking imagery.

## Color palette
- Ink: `#111315` — primary text and primary buttons
- Ink Soft: `#25282B` — secondary dark surfaces
- Body: `#62666B` — paragraph text
- Muted: `#85898D` — metadata and captions
- Rule: `#E5E5E2` — dividers and borders
- Paper: `#F7F7F4` — page background
- White: `#FFFFFF` — content surfaces
- Accent Blue: `#245BDB` — restrained links and emphasis
- Accent Tint: `#EAF0FF` — occasional highlight

Keep the site predominantly monochrome; blue is an accent, not the main canvas.

## Typography
Recommended family: Inter or Geist Sans.
- Display: clamp(44px, 6vw, 72px), weight 500, line-height .98
- H1: clamp(40px, 5vw, 60px), weight 500, line-height 1.02
- H2: clamp(32px, 3.6vw, 42px), weight 500, line-height 1.08
- H3: clamp(21px, 2vw, 24px), weight 550, line-height 1.2
- Body large: 18px / 1.55
- Body: 16px / 1.6
- Small: 13px / 1.45
- Eyebrow: 11px, 600, uppercase, .12em letter spacing
Use a single family and establish hierarchy with scale and spacing rather than heavy bolding.

## Layout and spacing
Base unit 4px. Spacing scale: 4, 8, 12, 16, 24, 32, 48, 64, 80, 96, 120, 160px.
- Max content width: 1440px
- Desktop gutters: 48–64px; tablet: 32px; mobile: 20–24px
- Section spacing: 88–128px desktop; 56–80px mobile
- Grid gap: 20–28px desktop; 16px mobile
- Use a 12-column desktop grid, 6-column tablet grid, and 4-column mobile grid.
Align headings, body copy, imagery, and dividers to a shared grid.

## Components
**Navigation:** wordmark left, compact links, one primary CTA; thin rule if needed.
**Primary button:** ink fill, white text, 48px height, 2–4px radius.
**Secondary button:** transparent/white fill, ink text, 1px border.
**Links:** clear underline or small arrow; avoid oversized decoration.
**Cards:** prefer open grid cells and dividers. Use restrained 2–6px radii only where useful.
**Section labels:** small uppercase eyebrow above headings.
**Project tiles:** consistent 4:3 or 3:2 imagery, project title, category, and concise outcome.
**Forms:** visible labels, clear focus states, useful errors, server-side validation.

## Homepage story
1. Hero: “Software for what’s next.” Short outcome-led copy and Start a Project / See Our Work actions.
2. Proof strip: publish only verified metrics.
3. Services: Web Applications, Mobile Applications, Desktop Applications, CRM/CMS/ERP, Custom Solutions.
4. Process: Discover, Plan, Design, Develop, Launch.
5. Why Classific: business focus, modern engineering, partnership, dependable support.
6. Selected work: real case studies and outcomes.
7. Client proof: approved logos and authentic testimonials only.
8. CTA: “Let’s build what’s next.”
9. Footer: concise navigation, contact, legal links.

## Imagery and art direction
Use architectural photography, concrete/stone, natural light, restrained shadows, real product screenshots, and natural device mockups. Keep photography neutral or low-saturation. No generic AI-looking blobs, neon glow, fake client logos, or invented metrics. The included homepage image crops are reference material, not isolated source layers.

## Motion and accessibility
Use 160–220ms ease-out transitions, subtle opacity/translation only, and honor `prefers-reduced-motion`. Provide semantic headings, alt text, keyboard navigation, visible focus, accessible contrast, and real CTA destinations.

## Responsive behavior
Desktop: editorial split hero and multi-column service/work grids. Tablet: reduce columns while preserving alignment. Mobile: single column, 20–24px gutters, stacked actions, no horizontal overflow, accessible collapsed navigation. Test 360, 390, 768, 1024, 1440, and 1920px widths.

## Production checklist
- Replace sample projects, metrics, logos, and testimonials with approved real content.
- Export final imagery as AVIF/WebP with responsive sources.
- Use SVG for logos, icons, and patterns.
- Optimize the hero for LCP; lazy-load below-fold images.
- Test keyboard navigation, focus, contrast, reduced motion, and all links/forms.
- The logo included is a starter concept and has not been trademark-cleared.
