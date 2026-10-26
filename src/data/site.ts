/**
 * Verified company facts only. Fields left empty are intentionally unpublished until
 * Classific confirms them. UI, SEO files and structured data read from here and
 * render nothing for empty values.
 */
export const site = {
    name: "Classific",
    legalName: "Classific",
    tagline: "Software for what's next.",
    description:
        "Classific is a software engineering studio that designs and builds web, mobile, desktop and enterprise software for real business challenges.",
    shortDescription:
        "A software engineering studio building web, mobile, desktop and enterprise systems for growing businesses.",
    locale: "en_US",
    language: "en",
    /** Verified contact channels. Empty until confirmed. */
    contact: {
        email: "",
        phone: "",
        address: "",
    },
    /** Verified public profiles. Empty until confirmed. */
    social: [] as Array<{ label: string; href: string }>,
    /** Default social image path relative to the site origin. */
    defaultOgImagePath: "/og/classific-og.png",
    twitterHandle: "",
} as const;

export type Site = typeof site;
