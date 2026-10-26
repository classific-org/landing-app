/**
 * Architectural hero composition built from the Classific pattern kit: layered planes,
 * contour lines and a dot grid. Decorative; hidden from assistive technology. Rendered
 * inline so it paints with the first HTML and does not delay the largest contentful paint.
 */
export function HeroComposition() {
    return (
        <div className="relative aspect-[4/5] w-full overflow-hidden rounded-sm border border-rule bg-white sm:aspect-[5/4] lg:aspect-[4/5]">
            <svg
                viewBox="0 0 400 500"
                preserveAspectRatio="xMidYMid slice"
                className="h-full w-full"
                aria-hidden="true"
                focusable="false"
            >
                <defs>
                    <pattern id="hero-dots" width="16" height="16" patternUnits="userSpaceOnUse">
                        <circle cx="2" cy="2" r="1" fill="var(--color-muted)" opacity=".45" />
                    </pattern>
                </defs>
                <rect width="400" height="500" fill="var(--color-white)" />
                <rect x="0" y="0" width="400" height="500" fill="url(#hero-dots)" opacity=".7" />
                <path d="M160 0H400V500H10Z" fill="var(--color-paper)" />
                <path d="M240 0H400V500H120Z" fill="var(--color-rule)" />
                <path d="M320 0H400V500H230Z" fill="#D6D9DE" />
                <path d="M380 0H400V500H330Z" fill="#C5CBD2" />
                <g stroke="var(--color-muted)" strokeWidth="1" opacity=".5" fill="none">
                    <path d="M-20 330C40 300 75 365 135 330S230 300 290 330 355 360 420 325" />
                    <path d="M-20 345C40 315 75 380 135 345S230 315 290 345 355 375 420 340" />
                    <path d="M-20 360C40 330 75 395 135 360S230 330 290 360 355 390 420 355" />
                    <path d="M-20 375C40 345 75 410 135 375S230 345 290 375 355 405 420 370" />
                    <path d="M-20 390C40 360 75 425 135 390S230 360 290 390 355 420 420 385" />
                </g>
                <g stroke="var(--color-ink)" strokeWidth="1" fill="none" opacity=".9">
                    <path d="M40 60h120" />
                    <path d="M40 60v120" />
                </g>
                <rect x="40" y="420" width="56" height="4" fill="var(--color-accent)" />
                <path d="M300 404 322 393l21 12v24l-21 11-22-12Z" fill="var(--color-ink)" />
                <path d="M310 410 322 404l12 6-12 6Z" fill="var(--color-white)" />
                <path d="M310 423 322 417l12 6-12 6Z" fill="var(--color-white)" />
                <path d="M322 404 334 410v13l-12-6Z" fill="var(--color-accent)" />
            </svg>
        </div>
    );
}
