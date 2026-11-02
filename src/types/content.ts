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
    /** The client the work was done for, when it may be named. */
    clientName?: string;
    summary: string;
    description: string;
    challenge: string;
    approach: string;
    solution: string;
    /** What changed for the client, as plain text with blank-line paragraphs. */
    results?: string;
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

/** A stretch of text with its own formatting; links are only ever web, mail, phone or site paths. */
export type InlineRun = { text: string; bold?: boolean; italic?: boolean; href?: string };

/**
 * Article body blocks. `text` and `items` always hold the plain text; `inline` and
 * `itemsInline` carry the same text with formatting when the content comes from the CMS.
 */
export type ArticleBlock =
    | { type: "paragraph"; text: string; inline?: InlineRun[] }
    | { type: "heading"; level: 2 | 3; text: string }
    | { type: "list"; items: string[]; ordered?: boolean; itemsInline?: InlineRun[][] }
    | {
          type: "image";
          src: string;
          alt: string;
          caption?: string;
          width?: number;
          height?: number;
      };

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
