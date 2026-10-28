import { PageHero } from "@/components/layout/PageHero";
import { Fold } from "@/components/layout/Fold";
import { EnquiryForm } from "@/components/forms/EnquiryForm";
import { Reveal } from "@/components/motion/Reveal";
import { BulletList } from "@/components/ui/BulletList";
import { useContactPage } from "@/pages/contact/ContactPage.hooks";

export function ContactPage() {
    const { breadcrumbs, hasDirectContact, contact, nextSteps } = useContactPage();

    return (
        <div className="relative overflow-x-clip">
            <PageHero
                eyebrow="Start a project"
                title="Tell us what you are building."
                copy="Share the challenge, the people it affects and the systems involved. A few sentences is enough to start."
                breadcrumbs={breadcrumbs}
            />

            <Fold
                tone="paper"
                id="enquiry-title"
                index="01"
                label="Direct inquiry"
                word={["Project", "enquiry"]}
                wordSize={13}
                intro="Fields marked required help us respond with something useful. Everything else is optional."
            >
                <div className="mt-14 grid gap-14 lg:mt-20 lg:grid-cols-12 lg:gap-12">
                    <div className="lg:col-span-4">
                        <Reveal className="lg:sticky lg:top-28">
                            <h3 className="eyebrow mb-5 text-ink">What happens next</h3>
                            <BulletList items={nextSteps} numbered />
                        </Reveal>

                        {hasDirectContact ? (
                            <Reveal delay={120}>
                                <address className="mt-12 space-y-2 border-t border-ink pt-6 text-small not-italic text-body">
                                    <h3 className="eyebrow mb-4 text-ink">Direct contact</h3>
                                    {contact.email ? (
                                        <p>
                                            <a
                                                href={`mailto:${contact.email}`}
                                                className="text-link"
                                            >
                                                {contact.email}
                                            </a>
                                        </p>
                                    ) : null}
                                    {contact.phone ? (
                                        <p>
                                            <a href={`tel:${contact.phone}`} className="text-link">
                                                {contact.phone}
                                            </a>
                                        </p>
                                    ) : null}
                                    {contact.address ? <p>{contact.address}</p> : null}
                                </address>
                            </Reveal>
                        ) : null}
                    </div>

                    <Reveal className="lg:col-span-8" delay={80}>
                        <div className="border border-rule border-t-ink bg-white p-6 sm:p-10 lg:p-12">
                            <div className="mb-10 flex items-center justify-between gap-4 font-mono text-[11px] uppercase tracking-[0.14em]">
                                <span className="text-ink">Enquiry form</span>
                                <span className="text-muted">
                                    <span className="text-accent">*</span> Required
                                </span>
                            </div>
                            <EnquiryForm />
                        </div>
                    </Reveal>
                </div>
            </Fold>
        </div>
    );
}
