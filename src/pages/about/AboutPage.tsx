import { Link } from "react-router";
import { PageHero } from "@/components/layout/PageHero";
import { Section } from "@/components/layout/Section";
import { SectionHeading } from "@/components/layout/SectionHeading";
import { ClosingCta } from "@/components/layout/ClosingCta";
import { Icon } from "@/components/ui/Icon";
import { useAboutPage } from "@/pages/about/AboutPage.hooks";

import modernOfficeImg from "@/assets/about/modern_office.jpg";

export function AboutPage() {
    const { description, philosophy, principles, services, breadcrumbs } = useAboutPage();

    return (
        <>
            <PageHero
                eyebrow="About Classific"
                title="A software engineering studio for real business challenges."
                copy={description}
                breadcrumbs={breadcrumbs}
            />

            {/* Positioning Section with Studio Visual */}
            <Section labelledBy="positioning-title" tone="white">
                <div className="grid gap-12 lg:grid-cols-12 lg:items-center lg:gap-10">
                    <div className="lg:col-span-5">
                        <SectionHeading
                            id="positioning-title"
                            eyebrow="Positioning"
                            title="Digital product engineering, with the business in the room."
                        />
                        <div className="mt-8 prose-editorial space-y-4">
                            <p>
                                Classific works with founders, operations leaders and established
                                organisations who need software that fits how they actually work. We
                                combine product design and engineering in one team, so decisions
                                about what to build and how to build it are made together.
                            </p>
                            <p>
                                Our work spans web, mobile and desktop applications, business
                                systems such as CRM, CMS and ERP, and custom software where no
                                existing product fits. Across all of it the standard is the same:
                                software that is dependable in daily use and affordable to change.
                            </p>
                        </div>
                    </div>

                    <div className="lg:col-span-7">
                        <div className="group relative overflow-hidden rounded-md border border-rule bg-paper shadow-sm">
                            <div className="aspect-[16/10] overflow-hidden">
                                <img
                                    src={modernOfficeImg}
                                    alt="Classific studio environment"
                                    className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                                    loading="lazy"
                                />
                            </div>
                            <div className="flex items-center justify-between border-t border-rule bg-white px-5 py-3 text-small text-muted font-mono">
                                <span>CLASSIFIC STUDIO ARCHITECTURE</span>
                                <span>LONDON &amp; DISTRIBUTED</span>
                            </div>
                        </div>
                    </div>
                </div>
            </Section>

            {/* Engineering Philosophy Cards */}
            <Section labelledBy="philosophy-title" tone="paper">
                <SectionHeading
                    id="philosophy-title"
                    eyebrow="Engineering philosophy"
                    title="Four habits we keep on every project."
                    intro="The practical principles that keep our software resilient, performant and straightforward to maintain long after first launch."
                    align="split"
                />
                <ol className="mt-12 grid gap-6 sm:grid-cols-2 lg:mt-16 lg:grid-cols-4">
                    {philosophy.map((point, index) => (
                        <li
                            key={point.title}
                            className="group flex flex-col justify-between rounded-md border border-rule bg-white p-7 shadow-xs transition-all duration-300 hover:-translate-y-1 hover:border-ink-soft/40 hover:shadow-lg"
                        >
                            <div>
                                <span className="rounded bg-paper px-2.5 py-1 font-mono text-[11px] text-muted border border-rule">
                                    0{index + 1}
                                </span>
                                <h3 className="mt-5 text-h3 font-medium transition-colors group-hover:text-accent">
                                    {point.title}
                                </h3>
                                <p className="mt-3 text-body text-body leading-relaxed">
                                    {point.description}
                                </p>
                            </div>
                            <div className="mt-6 border-t border-rule/60 pt-4">
                                <span className="font-mono text-[10px] uppercase tracking-wider text-muted">
                                    Core Principle
                                </span>
                            </div>
                        </li>
                    ))}
                </ol>
            </Section>

            {/* Partnership Section */}
            <Section labelledBy="partnership-title" tone="white">
                <div className="grid gap-12 lg:grid-cols-12 lg:gap-10">
                    <div className="lg:col-span-5">
                        <SectionHeading
                            id="partnership-title"
                            eyebrow="Partnership"
                            title="Built to last beyond the first release."
                            intro="We structure engagements so the relationship, the documentation and the codebase all survive launch."
                        />
                    </div>
                    <dl className="grid gap-6 sm:grid-cols-2 lg:col-span-7">
                        {principles.map((principle) => (
                            <div
                                key={principle.title}
                                className="group rounded-md border border-rule bg-paper/60 p-6 shadow-xs transition-all duration-300 hover:border-ink-soft/40 hover:bg-white hover:shadow-md"
                            >
                                <div className="flex h-10 w-10 items-center justify-center rounded border border-rule bg-white text-ink transition-colors group-hover:bg-accent group-hover:text-white group-hover:border-accent">
                                    <Icon name={principle.icon} className="h-5 w-5" />
                                </div>
                                <dt className="mt-4 text-body-lg font-medium text-ink transition-colors group-hover:text-accent">
                                    {principle.title}
                                </dt>
                                <dd className="mt-2 text-small text-body leading-relaxed">
                                    {principle.description}
                                </dd>
                            </div>
                        ))}
                    </dl>
                </div>
            </Section>

            {/* Services Overview List */}
            <Section labelledBy="about-services-title" tone="paper">
                <div className="grid gap-12 lg:grid-cols-12 lg:gap-10">
                    <div className="lg:col-span-4">
                        <SectionHeading
                            id="about-services-title"
                            eyebrow="What we do"
                            title="Services."
                            intro="Our five core engineering disciplines."
                        />
                    </div>
                    <ul className="divide-y divide-rule border-y border-rule lg:col-span-8">
                        {services.map((service) => (
                            <li key={service.slug} className="group">
                                <Link
                                    to={`/services/${service.slug}`}
                                    className="flex items-center justify-between gap-6 py-6 transition-colors hover:text-accent"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="flex h-9 w-9 items-center justify-center rounded border border-rule bg-white text-ink transition-colors group-hover:border-accent group-hover:text-accent">
                                            <Icon name={service.icon} className="h-4 w-4" />
                                        </div>
                                        <span className="text-h3 font-medium">{service.title}</span>
                                    </div>
                                    <Icon
                                        name="arrow-right"
                                        className="h-5 w-5 flex-none transition-transform duration-200 group-hover:translate-x-1"
                                    />
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>
            </Section>

            <ClosingCta />
        </>
    );
}
