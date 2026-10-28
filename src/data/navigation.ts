import type { NavItem } from "@/types/content";

export const primaryNavigation: NavItem[] = [
    { label: "Services", href: "/services" },
    { label: "Work", href: "/work" },
    { label: "Process", href: "/process" },
    { label: "About", href: "/about" },
];

export const primaryCta: NavItem = { label: "Start a Project", href: "/contact" };

export const companyNavigation: NavItem[] = [
    { label: "About", href: "/about" },
    { label: "Process", href: "/process" },
    { label: "Work", href: "/work" },
    { label: "Blog", href: "/blog" },
    { label: "Contact", href: "/contact" },
];

export const legalNavigation: NavItem[] = [
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms of Service", href: "/terms" },
];
