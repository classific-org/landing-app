import { Link } from "react-router";
import { PageHero } from "@/components/layout/PageHero";
import { Section } from "@/components/layout/Section";
import { SectionHeading } from "@/components/layout/SectionHeading";
import { ClosingCta } from "@/components/layout/ClosingCta";
import { Icon } from "@/components/ui/Icon";
import { Pattern } from "@/components/ui/Pattern";
import { useAboutPage } from "@/pages/about/AboutPage.hooks";

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

            <Section labelledBy="positioning-title" tone="white">
                <div className="grid gap-12 lg:grid-cols-12 lg:gap-8">
                    <div className="lg:col-span-5">
                        <SectionHeading
                            id="positioning-title"
                            eyebrow="Positioning"
                            title="Digital product engineering, with the business in the room."
                        />
                    </div>
                    <div className="prose-editorial lg:col-span-6 lg:col-start-7">
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
                    </div>
                </div>
            </Section>

            <Section labelledBy="philosophy-title" tone="paper">
                <SectionHeading
                    id="philosophy-title"
                    eyebrow="Engineering philosophy"
                    title="Four habits we keep on every project."
                    align="split"
                />
                <ol className="mt-12 grid gap-x-8 border-t border-rule sm:grid-cols-2 lg:mt-16 lg:grid-cols-4">
                    {philosophy.map((point, index) => (
                        <li key={point.title} className="border-b border-rule py-8 lg:border-b-0 lg:pr-8">
                            <span className="text-small tabular-nums text-body">
                                {(index + 1).toString().padStart(2, "0")}
                            </span>
                            <h3 className="mt-6 text-h3">{point.title}</h3>
                            <p className="mt-3 text-body text-body">{point.description}</p>
                        </li>
                    ))}
                </ol>
            </Section>

            <section aria-labelledby="partnership-title" className="relative overflow-hidden border-b border-rule bg-white">
                <Pattern variant="planes" className="pointer-events-none absolute right-0 top-0 hidden h-full w-1/3 opacity-70 lg:block" />
                <div className="container-page relative section-y">
                    <div className="grid gap-12 lg:grid-cols-12 lg:gap-8">
                        <div className="lg:col-span-5">
                            <SectionHeading
                                id="partnership-title"
                                eyebrow="Partnership"
                                title="Built to last beyond the first release."
                                intro="We structure engagements so the relationship, the documentation and the codebase all survive launch."
                            />
                        </div>
                        <dl className="grid gap-x-8 border-t border-rule sm:grid-cols-2 lg:col-span-6 lg:col-start-7">
                            {principles.map((principle) => (
                                <div key={principle.title} className="border-b border-rule py-6">
                                    <Icon name={principle.icon} className="h-5 w-5 text-ink" />
                                    <dt className="mt-4 text-body-lg font-medium text-ink">
                                        {principle.title}
                                    </dt>
                                    <dd className="mt-2 text-small text-body">{principle.description}</dd>
                                </div>
                            ))}
                        </dl>
                    </div>
                </div>
            </section>

            <Section labelledBy="about-services-title" tone="paper">
                <div className="grid gap-12 lg:grid-cols-12 lg:gap-8">
                    <div className="lg:col-span-4">
                        <SectionHeading id="about-services-title" eyebrow="What we do" title="Services." />
                    </div>
                    <ul className="divide-y divide-rule border-y border-rule lg:col-span-7 lg:col-start-6">
                        {services.map((service) => (
                            <li key={service.slug}>
                                <Link
                                    to={`/services/${service.slug}`}
                                    className="flex items-center justify-between gap-6 py-5 text-h3 transition-colors hover:text-body"
                                >
                                    <span>{service.title}</span>
                                    <Icon name="arrow-right" className="h-5 w-5 flex-none" />
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
