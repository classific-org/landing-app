import { companyNavigation, legalNavigation } from "@/data/navigation";
import { services } from "@/data/services";
import { site } from "@/data/site";
import type { NavItem } from "@/types/content";

export type SiteFooterViewModel = {
    description: string;
    serviceLinks: NavItem[];
    companyLinks: NavItem[];
    legalLinks: NavItem[];
    contact: { email: string; phone: string; address: string };
    social: ReadonlyArray<{ label: string; href: string }>;
    hasContact: boolean;
    copyright: string;
};

export function buildCopyright(year: number, name: string): string {
    return `© ${year} ${name}. All rights reserved.`;
}

export function useSiteFooter(now: () => Date = () => new Date()): SiteFooterViewModel {
    const contact = site.contact;
    const hasContact = Boolean(contact.email || contact.phone || contact.address);
    return {
        description: site.shortDescription,
        serviceLinks: services.map((service) => ({
            label: service.navLabel,
            href: `/services/${service.slug}`,
        })),
        companyLinks: companyNavigation,
        legalLinks: legalNavigation,
        contact,
        social: site.social,
        hasContact,
        copyright: buildCopyright(now().getFullYear(), site.name),
    };
}
