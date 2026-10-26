import { PageHero } from "@/components/layout/PageHero";
import { Section } from "@/components/layout/Section";
import { EnquiryForm } from "@/components/forms/EnquiryForm";
import { BulletList } from "@/components/ui/BulletList";
import { useContactPage } from "@/pages/contact/ContactPage.hooks";

export function ContactPage() {
    const { breadcrumbs, hasDirectContact, contact, nextSteps } = useContactPage();

    return (
        <>
            <PageHero
                eyebrow="Start a project"
                title="Tell us what you are building."
                copy="Share the challenge, the people it affects and the systems involved. A few sentences is enough to start."
                breadcrumbs={breadcrumbs}
            />

            <Section tone="white" labelledBy="enquiry-title" rule={false}>
                <div className="grid gap-12 lg:grid-cols-12 lg:gap-8">
                    <div className="lg:col-span-4">
                        <h2 id="enquiry-title" className="text-h2">
                            Project enquiry
                        </h2>
                        <p className="mt-6 text-body text-body">
                            Fields marked required help us respond with something useful. Everything
                            else is optional.
                        </p>
                        <h3 className="eyebrow mt-10 mb-4">What happens next</h3>
                        <BulletList items={nextSteps} numbered />
                        {hasDirectContact ? (
                            <address className="mt-10 space-y-2 text-small not-italic text-body">
                                <h3 className="eyebrow mb-4">Direct contact</h3>
                                {contact.email ? (
                                    <p>
                                        <a href={`mailto:${contact.email}`} className="text-link">
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
                        ) : null}
                    </div>
                    <div className="lg:col-span-7 lg:col-start-6">
                        <EnquiryForm />
                    </div>
                </div>
            </Section>
        </>
    );
}
