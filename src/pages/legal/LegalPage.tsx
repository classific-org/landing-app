import { Alert } from "@sometic/react/overlay";
import { PageHero } from "@/components/layout/PageHero";
import { Section } from "@/components/layout/Section";
import { NotFoundPage } from "@/pages/not-found/NotFoundPage";
import { useLegalPage } from "@/pages/legal/LegalPage.hooks";

export function LegalPage() {
    const model = useLegalPage();

    if (model.status === "missing") {
        return <NotFoundPage />;
    }

    const { document, reviewNotice, breadcrumbs, needsReviewCount } = model;

    return (
        <>
            <PageHero
                eyebrow="Legal"
                title={document.title}
                copy={document.intro}
                breadcrumbs={breadcrumbs}
            >
                <Alert
                    tone="warning"
                    className="mt-8 max-w-2xl border border-rule bg-accent-tint px-5 py-4 text-small text-ink"
                    data-testid="legal-review-notice"
                >
                    <p className="font-medium">Draft pending legal review</p>
                    <p className="mt-1 text-body">
                        {reviewNotice}
                        {needsReviewCount > 0
                            ? ` ${needsReviewCount} ${needsReviewCount === 1 ? "section is" : "sections are"} marked for confirmation.`
                            : ""}
                    </p>
                </Alert>
            </PageHero>

            <Section tone="white" labelledBy="legal-sections-title">
                <h2 id="legal-sections-title" className="sr-only">
                    {document.title} sections
                </h2>
                <div className="grid gap-12 lg:grid-cols-12 lg:gap-8">
                    <nav aria-label="Sections" className="lg:col-span-3">
                        <ol className="space-y-3 text-small">
                            {document.sections.map((section, index) => (
                                <li key={section.heading}>
                                    <a
                                        href={`#section-${index + 1}`}
                                        className="text-body hover:text-ink"
                                    >
                                        {section.heading}
                                    </a>
                                </li>
                            ))}
                        </ol>
                    </nav>
                    <div className="prose-editorial lg:col-span-7 lg:col-start-5">
                        {document.sections.map((section, index) => (
                            <section key={section.heading} id={`section-${index + 1}`}>
                                <h2>
                                    {section.heading}
                                    {section.needsReview ? (
                                        <span className="ml-3 align-middle text-small font-normal text-body">
                                            Requires review
                                        </span>
                                    ) : null}
                                </h2>
                                {section.paragraphs.map((paragraph) => (
                                    <p key={paragraph}>{paragraph}</p>
                                ))}
                            </section>
                        ))}
                        {document.lastUpdated ? (
                            <p className="text-small text-body">
                                Last updated {document.lastUpdated}
                            </p>
                        ) : (
                            <p className="text-small text-body">
                                Revision date will be recorded when the final text is approved.
                            </p>
                        )}
                    </div>
                </div>
            </Section>
        </>
    );
}
