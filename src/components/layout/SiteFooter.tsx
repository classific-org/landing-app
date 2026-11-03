import { Link } from "react-router";
import { Container } from "@/components/layout/Container";
import { useSiteFooter } from "@/components/layout/SiteFooter.hooks";
import { scrollToTop } from "@/lib/smooth-scroll";

/**
 * One quiet line under the closing scene, as on the reference site: the copyright, the legal
 * pages (the enquiry form's consent points to them) and a way back to the top.
 */
export function SiteFooter() {
    const { legalLinks, copyright } = useSiteFooter();

    return (
        <footer className="border-t border-rule bg-paper">
            <Container className="flex flex-col gap-4 py-6 text-small text-body sm:flex-row sm:items-center sm:justify-between">
                <p>{copyright}</p>
                <nav aria-label="Legal" className="flex flex-wrap items-center gap-x-6 gap-y-2">
                    {legalLinks.map((item) => (
                        <Link key={item.href} to={item.href} className="u-link hover:text-ink">
                            {item.label}
                        </Link>
                    ))}
                    <a
                        href="#top"
                        className="u-link hover:text-ink"
                        onClick={(event) => {
                            event.preventDefault();
                            scrollToTop();
                        }}
                    >
                        Back to top ↑
                    </a>
                </nav>
            </Container>
        </footer>
    );
}
