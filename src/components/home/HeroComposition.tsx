import { useHeroComposition } from "./HeroComposition.hooks";

/**
 * Architectural hero visual showcase featuring authentic engineering assets,
 * interactive perspective switcher, drafting blueprint marks, and floating glassmorphic
 * performance badges.
 */
export function HeroComposition() {
    const { perspectives, activePerspective, selectPerspective } = useHeroComposition();

    return (
        <div className="relative mx-auto w-full max-w-xl select-none lg:max-w-none">
            {/* Ambient subtle glow backdrop */}
            <div
                className="pointer-events-none absolute -inset-4 rounded-3xl opacity-40 blur-2xl"
                style={{
                    background:
                        "radial-gradient(circle at 70% 30%, rgba(36, 91, 219, 0.18), transparent 70%)",
                }}
                aria-hidden="true"
            />

            {/* Main Showcase Frame */}
            <div className="relative overflow-hidden rounded-md border border-rule bg-white shadow-xl transition-all duration-300 hover:border-ink-soft/40 hover:shadow-2xl">
                {/* Blueprint Drafting Corner Marks */}
                <div
                    className="pointer-events-none absolute left-3 top-3 z-20 font-mono text-[10px] text-muted opacity-60"
                    aria-hidden="true"
                >
                    +
                </div>
                <div
                    className="pointer-events-none absolute right-3 top-3 z-20 font-mono text-[10px] text-muted opacity-60"
                    aria-hidden="true"
                >
                    +
                </div>
                <div
                    className="pointer-events-none absolute bottom-14 left-3 z-20 font-mono text-[10px] text-muted opacity-60"
                    aria-hidden="true"
                >
                    +
                </div>
                <div
                    className="pointer-events-none absolute bottom-14 right-3 z-20 font-mono text-[10px] text-muted opacity-60"
                    aria-hidden="true"
                >
                    +
                </div>

                {/* Top Status Bar */}
                <div className="relative z-10 flex items-center justify-between border-b border-rule bg-paper/80 px-4 py-3 backdrop-blur-sm">
                    <div className="flex items-center gap-2">
                        <span className="relative flex h-2 w-2">
                            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-75" />
                            <span className="relative inline-flex h-2 w-2 rounded-full bg-accent" />
                        </span>
                        <span className="text-eyebrow font-medium text-ink">
                            SYSTEM PERSPECTIVE
                        </span>
                    </div>
                    <span className="text-[11px] font-mono tabular-nums text-muted">
                        LATENCY &lt; 28MS
                    </span>
                </div>

                {/* Image Viewport Container */}
                <div className="group relative aspect-[4/3] w-full overflow-hidden bg-neutral-900 sm:aspect-[16/11]">
                    <img
                        key={activePerspective.id}
                        src={activePerspective.image}
                        alt={activePerspective.alt}
                        className="h-full w-full object-cover object-center transition-all duration-700 ease-out group-hover:scale-[1.03]"
                        loading="eager"
                        decoding="async"
                    />

                    {/* Gradient Overlay for Depth and Text Contrast */}
                    <div
                        className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/70 via-ink/10 to-transparent"
                        aria-hidden="true"
                    />

                    {/* Floating Glassmorphic Top Badge */}
                    <div className="animate-float absolute left-4 top-4 z-10 flex items-center gap-2 rounded-full border border-white/20 bg-ink/75 px-3 py-1.5 shadow-lg backdrop-blur-md">
                        <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                        <span className="text-[11px] font-medium tracking-wide text-white">
                            {activePerspective.badge}
                        </span>
                    </div>

                    {/* Caption Overlay */}
                    <div className="absolute inset-x-4 bottom-4 z-10">
                        <div className="flex items-end justify-between">
                            <div>
                                <p className="text-[11px] uppercase tracking-wider text-rule">
                                    {activePerspective.label}
                                </p>
                                <p className="mt-0.5 text-small font-medium text-white">
                                    {activePerspective.caption}
                                </p>
                            </div>
                            <div className="hidden rounded border border-white/20 bg-white/10 px-2 py-1 text-[10px] font-mono text-white/90 backdrop-blur-md sm:block">
                                PROD-STABLE
                            </div>
                        </div>
                    </div>
                </div>

                {/* Interactive Perspective Selector Tabs */}
                <div className="grid grid-cols-2 divide-x divide-y divide-rule border-t border-rule bg-paper sm:grid-cols-4 sm:divide-y-0">
                    {perspectives.map((perspective) => {
                        const isActive = perspective.id === activePerspective.id;
                        return (
                            <button
                                key={perspective.id}
                                type="button"
                                onClick={() => selectPerspective(perspective.id)}
                                className={[
                                    "flex flex-col items-start px-3 py-2.5 text-left transition-all duration-200",
                                    isActive
                                        ? "bg-white text-ink shadow-sm"
                                        : "bg-paper text-body hover:bg-white/60 hover:text-ink",
                                ].join(" ")}
                                aria-pressed={isActive}
                            >
                                <span className="flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-wider">
                                    <span
                                        className={[
                                            "inline-block h-1.5 w-1.5 rounded-full transition-colors",
                                            isActive ? "bg-accent" : "bg-muted/50",
                                        ].join(" ")}
                                    />
                                    {perspective.label}
                                </span>
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Bottom Offset Performance Pill */}
            <div className="mt-4 flex items-center justify-between px-2 text-small text-body">
                <span className="flex items-center gap-2">
                    <svg
                        className="h-4 w-4 text-accent"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                    >
                        <path d="M12 22s8-4 8-11V5l-8-3-8 3v6c0 7 8 11 8 11Z" />
                        <path d="m9 12 2 2 4-4" />
                    </svg>
                    <span className="font-medium text-ink">Enterprise Verification:</span>
                    <span>100% Code Handover &amp; Automated CI/CD</span>
                </span>
                <span className="hidden font-mono text-xs text-muted sm:inline-block">
                    SLAs &amp; Continuous Support
                </span>
            </div>
        </div>
    );
}
