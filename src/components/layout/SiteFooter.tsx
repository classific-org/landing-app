import { Link } from "react-router";
import { Container } from "@/components/layout/Container";
import { Wordmark } from "@/components/ui/Wordmark";
import { useSiteFooter } from "@/components/layout/SiteFooter.hooks";

export function SiteFooter() {
    const {
        description,
        serviceLinks,
        companyLinks,
        legalLinks,
        contact,
        social,
        hasContact,
        copyright,
    } = useSiteFooter();

    return (
        <footer className="border-t border-rule bg-paper">
            <Container className="py-16 lg:py-20">
                <div className="grid gap-12 lg:grid-cols-12 lg:gap-8">
                    <div className="lg:col-span-4">
                        <Link to="/" className="inline-flex" aria-label="Classific home">
                            <Wordmark className="h-7 w-auto" />
                        </Link>
                        <p className="mt-6 max-w-sm text-body text-body">{description}</p>
                    </div>

                    <nav aria-labelledby="footer-services" className="lg:col-span-3 lg:col-start-6">
                        <h2 id="footer-services" className="eyebrow mb-5">
                            Services
                        </h2>
                        <ul className="space-y-3">
                            {serviceLinks.map((item) => (
                                <li key={item.href}>
                                    <Link
                                        to={item.href}
                                        className="text-small text-body transition-colors hover:text-ink"
                                    >
                                        {item.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </nav>

                    <nav aria-labelledby="footer-company" className="lg:col-span-2">
                        <h2 id="footer-company" className="eyebrow mb-5">
                            Company
                        </h2>
                        <ul className="space-y-3">
                            {companyLinks.map((item) => (
                                <li key={item.href}>
                                    <Link
                                        to={item.href}
                                        className="text-small text-body transition-colors hover:text-ink"
                                    >
                                        {item.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </nav>

                    <div className="lg:col-span-2">
                        <h2 className="eyebrow mb-5">Contact</h2>
                        {hasContact ? (
                            <address className="space-y-3 text-small not-italic text-body">
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
                        ) : (
                            <p className="text-small text-body">
                                <Link to="/contact" className="text-link">
                                    Start a project enquiry
                                </Link>
                            </p>
                        )}
                        {social.length > 0 ? (
                            <ul className="mt-5 space-y-3">
                                {social.map((entry) => (
                                    <li key={entry.href}>
                                        <a
                                            href={entry.href}
                                            className="text-small text-body hover:text-ink"
                                            rel="noopener noreferrer"
                                            target="_blank"
                                        >
                                            {entry.label}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        ) : null}
                    </div>
                </div>

                <div className="mt-16 flex flex-col gap-4 border-t border-rule pt-6 text-small text-body sm:flex-row sm:items-center sm:justify-between">
                    <p>{copyright}</p>
                    <ul className="flex gap-6">
                        {legalLinks.map((item) => (
                            <li key={item.href}>
                                <Link to={item.href} className="transition-colors hover:text-ink">
                                    {item.label}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>
            </Container>
        </footer>
    );
}
