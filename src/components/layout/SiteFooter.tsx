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
                        <p className="mt-5 max-w-sm text-body text-body leading-relaxed">
                            {description}
                        </p>

                        <div className="mt-6">
                            <span className="inline-flex items-center gap-2 rounded-full border border-rule bg-white/90 px-3 py-1 font-mono text-[11px] text-body shadow-xs">
                                <span className="relative flex h-2 w-2">
                                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-75" />
                                    <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-600" />
                                </span>
                                <span>Global studio • Open for inquiries</span>
                            </span>
                        </div>
                    </div>

                    <nav aria-labelledby="footer-services" className="lg:col-span-3 lg:col-start-6">
                        <h2 id="footer-services" className="eyebrow mb-5 text-ink">
                            Services
                        </h2>
                        <ul className="space-y-3">
                            {serviceLinks.map((item) => (
                                <li key={item.href}>
                                    <Link
                                        to={item.href}
                                        className="text-small text-body transition-colors hover:text-accent"
                                    >
                                        {item.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </nav>

                    <nav aria-labelledby="footer-company" className="lg:col-span-2">
                        <h2 id="footer-company" className="eyebrow mb-5 text-ink">
                            Company
                        </h2>
                        <ul className="space-y-3">
                            {companyLinks.map((item) => (
                                <li key={item.href}>
                                    <Link
                                        to={item.href}
                                        className="text-small text-body transition-colors hover:text-accent"
                                    >
                                        {item.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </nav>

                    <div className="lg:col-span-2">
                        <h2 className="eyebrow mb-5 text-ink">Contact</h2>
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
                            <div className="space-y-3">
                                <p className="text-small text-body">
                                    <Link to="/contact" className="text-link font-medium">
                                        Start a project enquiry
                                    </Link>
                                </p>
                                <p className="font-mono text-[11px] text-muted">
                                    Response within 24 business hours.
                                </p>
                            </div>
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

                <div className="mt-16 flex flex-col gap-4 border-t border-rule pt-8 text-small text-muted sm:flex-row sm:items-center sm:justify-between">
                    <p className="font-mono text-xs">{copyright}</p>
                    <ul className="flex gap-6">
                        {legalLinks.map((item) => (
                            <li key={item.href}>
                                <Link
                                    to={item.href}
                                    className="transition-colors hover:text-ink font-mono text-xs"
                                >
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
