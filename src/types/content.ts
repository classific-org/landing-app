export type IconName =
    | "monitor"
    | "smartphone"
    | "app-window"
    | "layers"
    | "code"
    | "workflow"
    | "shield-check"
    | "arrow-right";

export type PublicationStatus = "published" | "draft" | "placeholder";

export type Faq = {
    question: string;
    answer: string;
};

export type NavItem = {
    label: string;
    href: string;
};

export type SeoCopy = {
    title: string;
    description: string;
};

export type Capability = {
    title: string;
    description: string;
};

export type ServiceSlug =
    | "web-applications"
    | "mobile-applications"
    | "desktop-applications"
    | "crm-cms-erp"
    | "custom-software";

export type Service = {
    slug: ServiceSlug;
    title: string;
    navLabel: string;
    icon: IconName;
    /** One line used on listings. */
    summary: string;
    /** Short paragraph used on the services overview. */
    description: string;
    hero: {
        eyebrow: string;
        headline: string;
        copy: string;
    };
    problems: string[];
    capabilities: Capability[];
    useCases: string[];
    deliverables: string[];
    faqs: Faq[];
    relatedServices: ServiceSlug[];
    seo: SeoCopy;
};

export type ImageAsset = {
    src: string;
    alt: string;
    width: number;
    height: number;
};

export type VerifiedOutcome = {
    label: string;
    value: string;
    /** Only outcomes confirmed by the client or Classific records may be published. */
    verified: true;
};

export type Project = {
    slug: string;
    title: string;
    category: string;
    status: PublicationStatus;
    summary: string;
    description: string;
    challenge: string;
    approach: string;
    solution: string;
    image?: ImageAsset;
    gallery?: ImageAsset[];
    technologies: string[];
    projectUrl?: string;
    outcomes?: VerifiedOutcome[];
    services: ServiceSlug[];
    publishedAt?: string;
    seo?: SeoCopy;
};

export type ProcessStage = {
    number: number;
    slug: string;
    title: string;
    summary: string;
    description: string;
    activities: string[];
    deliverables: string[];
    clientProvides: string[];
};

export type Principle = {
    title: string;
    description: string;
    icon: IconName;
};

export type ArticleBlock =
    | { type: "paragraph"; text: string }
    | { type: "heading"; level: 2 | 3; text: string }
    | { type: "list"; items: string[] };

export type Article = {
    slug: string;
    title: string;
    excerpt: string;
    status: PublicationStatus;
    coverImage?: ImageAsset;
    publishedAt: string;
    updatedAt?: string;
    author: { name: string };
    categories: string[];
    body: ArticleBlock[];
    seo?: SeoCopy;
};

export type LegalSection = {
    heading: string;
    paragraphs: string[];
    /** Marks a section whose content depends on facts legal counsel must confirm. */
    needsReview?: boolean;
};

export type LegalDocument = {
    slug: "privacy" | "terms";
    title: string;
    intro: string;
    lastUpdated?: string;
    sections: LegalSection[];
    seo: SeoCopy;
};
