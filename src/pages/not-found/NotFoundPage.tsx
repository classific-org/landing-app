import { Section } from "@/components/layout/Section";
import { Eyebrow } from "@/components/layout/Eyebrow";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { TextLink } from "@/components/ui/TextLink";
import { useNotFoundPage } from "@/pages/not-found/NotFoundPage.hooks";

export function NotFoundPage() {
    const { pathname, suggestions } = useNotFoundPage();

    return (
        <Section rule={false} labelledBy="not-found-title" className="flex-1">
            <div className="max-w-2xl">
                <Eyebrow className="mb-4">404</Eyebrow>
                <h1 id="not-found-title" className="text-h1">
                    This page does not exist.
                </h1>
                <p className="mt-6 text-body-lg text-body">
                    There is nothing at <code className="text-ink">{pathname}</code>. The link may
                    be out of date, or the address may have been typed incorrectly.
                </p>
                <div className="mt-10 flex flex-wrap gap-4">
                    <ButtonLink to="/" variant="primary">
                        Back to home
                    </ButtonLink>
                    <ButtonLink to="/contact" variant="secondary">
                        Contact Classific
                    </ButtonLink>
                </div>
                <ul className="mt-12 flex flex-wrap gap-x-8 gap-y-3 border-t border-rule pt-6">
                    {suggestions.map((item) => (
                        <li key={item.href}>
                            <TextLink to={item.href}>{item.label}</TextLink>
                        </li>
                    ))}
                </ul>
            </div>
        </Section>
    );
}
