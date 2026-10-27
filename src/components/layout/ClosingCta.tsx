import { Container } from "@/components/layout/Container";
import { Eyebrow } from "@/components/layout/Eyebrow";
import { ButtonLink } from "@/components/ui/ButtonLink";
import darkMountainImg from "@/assets/about/dark_mountain_texture.jpg";

type ClosingCtaProps = {
    headline?: string;
    copy?: string;
    primaryLabel?: string;
    primaryTo?: string;
    secondaryLabel?: string;
    secondaryTo?: string;
};

export function ClosingCta({
    headline = "Let's build what's next.",
    copy = "Tell us about the challenge in front of your business. We will respond with questions, a point of view and a clear next step.",
    primaryLabel = "Start a Project",
    primaryTo = "/contact",
    secondaryLabel,
    secondaryTo,
}: ClosingCtaProps) {
    return (
        <section
            aria-labelledby="closing-cta-title"
            className="relative overflow-hidden bg-ink text-paper"
        >
            {/* Subtle Architectural Texture & Lighting */}
            <div className="pointer-events-none absolute inset-0 opacity-20">
                <img
                    src={darkMountainImg}
                    alt=""
                    className="h-full w-full object-cover object-bottom"
                    loading="lazy"
                />
            </div>
            <div
                className="pointer-events-none absolute -right-20 -top-20 h-96 w-96 rounded-full opacity-20 blur-3xl"
                style={{
                    background: "radial-gradient(circle, rgba(36, 91, 219, 0.4), transparent 70%)",
                }}
                aria-hidden="true"
            />

            <Container className="relative section-y">
                <div className="grid gap-10 lg:grid-cols-12 lg:items-center lg:gap-12">
                    <div className="lg:col-span-7">
                        <div className="flex items-center gap-2 mb-4">
                            <span className="relative flex h-2 w-2">
                                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-75" />
                                <span className="relative inline-flex h-2 w-2 rounded-full bg-accent" />
                            </span>
                            <Eyebrow tone="paper">Start a conversation</Eyebrow>
                        </div>
                        <h2 id="closing-cta-title" className="text-h1 text-paper leading-tight">
                            {headline}
                        </h2>
                        <div className="mt-8 flex flex-wrap gap-4 text-[12px] font-mono text-rule/80">
                            <span className="flex items-center gap-1.5">
                                <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                                24-Hour Response Time
                            </span>
                            <span className="flex items-center gap-1.5">
                                <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                                Principal Engineer Consultation
                            </span>
                            <span className="flex items-center gap-1.5">
                                <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                                Transparent Scope &amp; Milestones
                            </span>
                        </div>
                    </div>

                    <div className="lg:col-span-5 lg:col-start-8">
                        <div className="rounded-md border border-white/10 bg-white/5 p-8 backdrop-blur-md">
                            <p className="text-body-lg text-rule leading-relaxed">{copy}</p>
                            <div className="mt-8 flex flex-wrap gap-4">
                                <ButtonLink to={primaryTo} variant="inverse" withArrow>
                                    {primaryLabel}
                                </ButtonLink>
                                {secondaryLabel && secondaryTo ? (
                                    <ButtonLink to={secondaryTo} variant="ghost-inverse">
                                        {secondaryLabel}
                                    </ButtonLink>
                                ) : null}
                            </div>
                        </div>
                    </div>
                </div>
            </Container>
        </section>
    );
}
