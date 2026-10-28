/**
 * The hero "thread": one continuous blue line that draws itself through the headline, loops
 * around a few letters and drops to a node. It is purely decorative. The path is drawn with
 * pathLength=1 so CSS can animate the stroke without measuring it, and it stretches with the
 * headline block it overlays.
 */
export function HeroThread() {
    return (
        <svg
            className="hero-thread pointer-events-none absolute inset-0 h-full w-full overflow-visible"
            viewBox="0 0 1000 600"
            preserveAspectRatio="none"
            aria-hidden="true"
            focusable="false"
        >
            <circle className="hero-thread-start" cx="24" cy="34" r="5" />
            <path
                className="hero-thread-line"
                pathLength={1}
                d="M24 34 C150 -12 330 26 480 80 C600 124 650 176 566 196 C474 218 430 150 524 138 C610 128 420 246 120 276 C-14 292 -14 392 96 404 C320 424 700 392 958 404 C1032 410 1010 492 930 488 C850 484 868 420 952 442 C990 454 960 520 912 540 C868 558 900 600 884 636 C876 654 872 668 872 676"
            />
            <circle className="hero-thread-ring" cx="872" cy="700" r="22" />
            <circle className="hero-thread-node" cx="872" cy="700" r="6" />
        </svg>
    );
}
