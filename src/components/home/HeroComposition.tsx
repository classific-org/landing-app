import { useParallax } from "@/components/motion/motion.hooks";
import { useHeroComposition } from "./HeroComposition.hooks";

/**
 * Hero visual: one tall frame of authentic engineering imagery that drifts slowly against the
 * scroll, with a numbered perspective index beneath it. Images crossfade; nothing floats.
 */
export function HeroComposition() {
    const { perspectives, activePerspective, selectPerspective } = useHeroComposition();
    const parallaxRef = useParallax<HTMLDivElement>(6);
    const activeIndex = perspectives.findIndex((p) => p.id === activePerspective.id);

    return (
        <figure className="select-none">
            <div
                ref={parallaxRef}
                className="relative aspect-[4/5] w-full overflow-hidden border border-rule bg-ink sm:aspect-[5/6] lg:aspect-[4/5]"
            >
                {perspectives.map((perspective, index) => {
                    const isActive = index === activeIndex;
                    return (
                        <img
                            key={perspective.id}
                            src={perspective.image}
                            alt={isActive ? perspective.alt : ""}
                            aria-hidden={isActive ? undefined : true}
                            className="parallax-image absolute inset-0 transition-opacity duration-[1100ms] ease-[cubic-bezier(0.4,0,0.2,1)]"
                            style={{ opacity: isActive ? 1 : 0 }}
                            loading={index === 0 ? "eager" : "lazy"}
                            decoding="async"
                        />
                    );
                })}

                <div
                    className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-ink/75 to-transparent"
                    aria-hidden="true"
                />

                <figcaption className="absolute inset-x-5 bottom-5 flex items-end justify-between gap-4 text-paper">
                    <div>
                        <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-rule">
                            {activePerspective.label}
                        </p>
                        <p className="mt-1.5 max-w-[16rem] text-small font-medium leading-snug">
                            {activePerspective.caption}
                        </p>
                    </div>
                    <span
                        className="font-mono text-[11px] tabular-nums text-rule"
                        aria-hidden="true"
                    >
                        {String(activeIndex + 1).padStart(2, "0")} /{" "}
                        {String(perspectives.length).padStart(2, "0")}
                    </span>
                </figcaption>
            </div>

            <div role="group" aria-label="Hero perspective" className="mt-4 grid grid-cols-4 gap-2">
                {perspectives.map((perspective, index) => {
                    const isActive = index === activeIndex;
                    return (
                        <button
                            key={perspective.id}
                            type="button"
                            onClick={() => selectPerspective(perspective.id)}
                            aria-pressed={isActive}
                            aria-label={perspective.label}
                            className="group relative py-3 text-left font-mono text-[10px] uppercase tracking-[0.1em]"
                        >
                            <span
                                className="absolute inset-x-0 top-0 h-px bg-rule"
                                aria-hidden="true"
                            />
                            <span
                                className="absolute inset-x-0 top-0 h-px origin-left bg-ink transition-transform duration-[600ms] ease-[cubic-bezier(0.16,1,0.3,1)]"
                                style={{ transform: `scaleX(${isActive ? 1 : 0})` }}
                                aria-hidden="true"
                            />
                            <span
                                className={[
                                    "block tabular-nums transition-colors",
                                    isActive ? "text-ink" : "text-muted group-hover:text-ink",
                                ].join(" ")}
                            >
                                {String(index + 1).padStart(2, "0")}
                            </span>
                            <span
                                className={[
                                    "mt-1 hidden transition-colors sm:block",
                                    isActive ? "text-ink" : "text-muted group-hover:text-ink",
                                ].join(" ")}
                            >
                                {perspective.label}
                            </span>
                        </button>
                    );
                })}
            </div>
        </figure>
    );
}
