import { Container } from "@/components/layout/Container";
import { Eyebrow } from "@/components/layout/Eyebrow";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { Pattern } from "@/components/ui/Pattern";

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
        <section aria-labelledby="closing-cta-title" className="relative overflow-hidden bg-ink text-paper">
            <Pattern
                variant="contour"
                className="pointer-events-none absolute inset-x-0 bottom-0 h-48 w-full opacity-60"
            />
            <Container className="relative section-y">
                <div className="grid gap-10 lg:grid-cols-12 lg:gap-8">
                    <div className="lg:col-span-7">
                        <Eyebrow className="mb-4" tone="paper">
                            Start a conversation
                        </Eyebrow>
                        <h2 id="closing-cta-title" className="text-h1 text-paper">
                            {headline}
                        </h2>
                    </div>
                    <div className="lg:col-span-4 lg:col-start-9 lg:self-end">
                        <p className="text-body-lg text-rule">{copy}</p>
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
            </Container>
        </section>
    );
}
