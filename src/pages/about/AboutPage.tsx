import { PageHero } from "@/components/layout/PageHero";
import { Fold } from "@/components/layout/Fold";
import { ClosingCta } from "@/components/layout/ClosingCta";
import { ThreadedPage } from "@/components/layout/ThreadedPage";
import { ParallaxImage, Reveal } from "@/components/motion/Reveal";
import { ServiceIndex } from "@/components/services/ServiceIndex";
import { Icon } from "@/components/ui/Icon";
import { useAboutPage } from "@/pages/about/AboutPage.hooks";

import modernOfficeImg from "@/assets/about/modern_office.jpg";

export function AboutPage() {
    const { description, philosophy, principles, services, breadcrumbs } = useAboutPage();

    return (
        <ThreadedPage>
            <PageHero
                eyebrow="About Classific"
                word="About"
                title="A software engineering studio for real business challenges."
                copy={description}
                breadcrumbs={breadcrumbs}
                thread
            />

            <Fold
                tone="paper"
                id="positioning-title"
                index="01"
                label="Positioning"
                word={["Digital product", "engineering, with", "the business", "in the room."]}
                wordSize={8.2}
                node
            >
                {/* The studio image is small, so it sits in a narrow column instead of being stretched. */}
                <div className="mt-14 grid gap-12 lg:mt-20 lg:grid-cols-12 lg:gap-10">
                    <Reveal variant="clip" className="lg:col-span-5">
                        <ParallaxImage
                            src={modernOfficeImg}
                            alt="Classific studio environment"
                            className="aspect-[5/4] border border-rule"
                            strength={9}
                        />
                        <div className="mt-3 flex items-center justify-between font-mono text-[11px] uppercase tracking-[0.1em] text-muted">
                            <span>Classific studio architecture</span>
                            <span>London &amp; distributed</span>
                        </div>
                    </Reveal>

                    <Reveal
                        className="prose-editorial space-y-5 lg:col-span-5 lg:col-start-8"
                        delay={120}
                    >
                        <p>
                            Classific works with founders, operations leaders and established
                            organisations who need software that fits how they actually work. We
                            combine product design and engineering in one team, so decisions about
                            what to build and how to build it are made together.
                        </p>
                        <p>
                            Our work spans web, mobile and desktop applications, business systems
                            such as CRM, CMS and ERP, and custom software where no existing product
                            fits. Across all of it the standard is the same: software that is
                            dependable in daily use and affordable to change.
                        </p>
                    </Reveal>
                </div>
            </Fold>

            <Fold
                tone="ink"
                id="philosophy-title"
                index="02"
                label="Engineering philosophy"
                word={["Four habits we", "keep on every", "project."]}
                wordSize={10}
                intro="The practical principles that keep our software resilient, performant and straightforward to maintain long after first launch."
                node
            >
                <ol className="mt-14 grid gap-x-8 sm:grid-cols-2 lg:mt-20 lg:grid-cols-4">
                    {philosophy.map((point, index) => (
                        <Reveal
                            as="li"
                            key={point.title}
                            delay={index * 90}
                            className="border-t border-paper/40 py-8 lg:pb-0 lg:pr-4"
                        >
                            <span
                                className="block font-mono text-[clamp(2.5rem,5vw,4rem)] font-medium leading-none tracking-[-0.06em] text-paper/20"
                                aria-hidden="true"
                            >
                                0{index + 1}
                            </span>
                            <h3 className="mt-10 text-h3 text-paper lg:mt-16">{point.title}</h3>
                            <p className="mt-3 text-body text-paper/75">{point.description}</p>
                        </Reveal>
                    ))}
                </ol>
            </Fold>

            <Fold
                tone="paper"
                id="partnership-title"
                index="03"
                label="Partnership"
                word={["Built to last", "beyond the", "first release."]}
                wordSize={10}
                intro="We structure engagements so the relationship, the documentation and the codebase all survive launch."
                node
            >
                <ul className="mt-14 grid gap-x-10 sm:grid-cols-2 lg:mt-20 lg:grid-cols-4">
                    {principles.map((principle, index) => (
                        <Reveal
                            as="li"
                            key={principle.title}
                            delay={index * 90}
                            className="group border-t border-ink py-8 lg:py-10"
                        >
                            <Icon
                                name={principle.icon}
                                className="h-5 w-5 text-ink transition-colors duration-300 group-hover:text-accent"
                            />
                            <h3 className="mt-10 text-h3 lg:mt-14">{principle.title}</h3>
                            <p className="mt-3 max-w-sm text-body text-body">
                                {principle.description}
                            </p>
                        </Reveal>
                    ))}
                </ul>
            </Fold>

            <Fold
                tone="ink"
                id="about-services-title"
                index="04"
                label="What we do"
                word="Services."
                wordSize={16}
                intro="Our five core engineering disciplines."
            >
                <div className="mt-14 lg:mt-20">
                    <ServiceIndex services={services} layout="grid" tone="dark" thread />
                </div>
            </Fold>

            <ClosingCta tangle />
        </ThreadedPage>
    );
}
