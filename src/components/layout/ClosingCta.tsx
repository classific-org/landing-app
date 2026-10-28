import { Container } from "@/components/layout/Container";
import { Eyebrow } from "@/components/layout/Eyebrow";
import { useLineDrift } from "@/components/motion/motion.hooks";
import { ParallaxImage, Reveal, TextReveal } from "@/components/motion/Reveal";
import { ButtonLink } from "@/components/ui/ButtonLink";
import darkMountainImg from "@/assets/about/dark_mountain_texture.jpg";

type ClosingCtaProps = {
    headline?: string;
    copy?: string;
    primaryLabel?: string;
    primaryTo?: string;
    secondaryLabel?: string;
    secondaryTo?: string;
    /** Leaves room beside the headline for the home page thread to end in a tangle. */
    tangle?: boolean;
};

const commitments = [
    "24-Hour Response Time",
    "Principal Engineer Consultation",
    "Transparent Scope & Milestones",
];

/** Splits a headline at the space nearest its middle, giving two balanced lines. */
function splitHeadline(headline: string): string[] {
    const middle = headline.length / 2;
    let best = -1;
    for (let index = 0; index < headline.length; index += 1) {
        if (
            headline[index] === " " &&
            (best < 0 || Math.abs(index - middle) < Math.abs(best - middle))
        ) {
            best = index;
        }
    }
    return best < 0 ? [headline] : [headline.slice(0, best), headline.slice(best + 1)];
}

export function ClosingCta({
    headline = "Let's build what's next.",
    copy = "Tell us about the challenge in front of your business. We will respond with questions, a point of view and a clear next step.",
    primaryLabel = "Start a Project",
    primaryTo = "/contact",
    secondaryLabel,
    secondaryTo,
    tangle = false,
}: ClosingCtaProps) {
    const headingRef = useLineDrift<HTMLHeadingElement>();

    return (
        <section
            aria-labelledby="closing-cta-title"
            className="relative overflow-hidden bg-ink text-paper"
        >
            <ParallaxImage
                src={darkMountainImg}
                alt=""
                className="pointer-events-none absolute inset-0 opacity-25"
                strength={10}
            />
            <div
                className="pointer-events-none absolute inset-0 bg-gradient-to-b from-ink via-transparent to-ink opacity-70"
                aria-hidden="true"
            />

            <Container className="relative section-y">
                <Reveal>
                    <Eyebrow tone="paper" className="mb-10 lg:mb-14">
                        Start a conversation
                    </Eyebrow>
                </Reveal>

                <div className={tangle ? "grid gap-10 lg:grid-cols-12 lg:items-center" : ""}>
                    <h2
                        ref={headingRef}
                        id="closing-cta-title"
                        className={`drift text-display text-paper ${
                            tangle ? "lg:col-span-7" : "max-w-5xl"
                        }`}
                    >
                        <TextReveal lines={splitHeadline(headline)} />
                    </h2>
                    {tangle ? (
                        <div
                            data-thread-tangle
                            className="hidden aspect-[5/4] lg:col-span-4 lg:col-start-9 lg:block"
                            aria-hidden="true"
                        />
                    ) : null}
                </div>

                <div className="mt-14 grid gap-10 border-t border-paper/15 pt-10 lg:mt-24 lg:grid-cols-12 lg:gap-8 lg:pt-12">
                    <Reveal className="lg:col-span-5">
                        <p className="max-w-md text-body-lg text-rule">{copy}</p>
                        <div className="mt-10 flex flex-wrap gap-4">
                            <ButtonLink to={primaryTo} variant="inverse" withArrow>
                                {primaryLabel}
                            </ButtonLink>
                            {secondaryLabel && secondaryTo ? (
                                <ButtonLink to={secondaryTo} variant="ghost-inverse">
                                    {secondaryLabel}
                                </ButtonLink>
                            ) : null}
                        </div>
                    </Reveal>

                    <ul className="grid gap-0 lg:col-span-5 lg:col-start-8">
                        {commitments.map((item, index) => (
                            <Reveal
                                as="li"
                                key={item}
                                delay={index * 90}
                                className="flex items-baseline justify-between gap-6 border-b border-paper/15 py-4 font-mono text-[12px] text-rule/80 first:pt-0"
                            >
                                <span>{item}</span>
                                <span className="tabular-nums text-rule/50" aria-hidden="true">
                                    0{index + 1}
                                </span>
                            </Reveal>
                        ))}
                    </ul>
                </div>
            </Container>
        </section>
    );
}
