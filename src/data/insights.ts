import type { Article } from "@/types/content";

const author = { name: "Classific" };

/**
 * Insights articles. Only "published" entries are rendered, routed or exported.
 * Add a new article object here; no layout component needs to change.
 */
export const articles: Article[] = [
    {
        slug: "what-discovery-actually-decides",
        title: "What discovery actually decides",
        excerpt:
            "Discovery is often treated as a formality before the real work. In practice it decides the shape, cost and risk of everything that follows.",
        status: "published",
        publishedAt: "2026-02-10",
        author,
        categories: ["Process"],
        body: [
            {
                type: "paragraph",
                text: "Most software projects begin with a request that sounds like a solution: a portal, an app, a new CRM. Discovery exists to find the problem behind that request before anyone commits to building it.",
            },
            { type: "heading", level: 2, text: "Three decisions discovery makes" },
            {
                type: "list",
                items: [
                    "What success looks like, stated in terms the business already measures.",
                    "Which constraints are real: existing systems, regulation, team capacity and timing.",
                    "Where the uncertainty is highest, so it can be tackled first instead of last.",
                ],
            },
            {
                type: "paragraph",
                text: "None of these decisions requires a long engagement. They do require conversations with the people who do the work today, a look at the systems they use and the discipline to write the findings down.",
            },
            { type: "heading", level: 2, text: "What good discovery produces" },
            {
                type: "paragraph",
                text: "The output is short: a problem statement everyone recognises, a list of scope boundaries and a list of open questions. When those three exist, estimates become meaningful and the first release can be planned around real priorities.",
            },
            {
                type: "paragraph",
                text: "When they are skipped, the same questions surface during development, where every answer is more expensive.",
            },
        ],
    },
    {
        slug: "choosing-between-web-mobile-and-desktop",
        title: "Choosing between web, mobile and desktop",
        excerpt:
            "The platform question is answered too early in many projects. A short checklist keeps the decision tied to how the software will actually be used.",
        status: "published",
        publishedAt: "2026-03-18",
        author,
        categories: ["Engineering", "Strategy"],
        body: [
            {
                type: "paragraph",
                text: "Web is the default for good reasons: no installation, instant updates and one codebase for every device with a browser. It is still a choice, and the alternatives are the right answer more often than teams expect.",
            },
            { type: "heading", level: 2, text: "Questions that change the answer" },
            {
                type: "list",
                items: [
                    "Will people use this without a reliable connection?",
                    "Does the software need the camera, sensors, printers or other hardware?",
                    "Is the work done at a desk, on the move or on a production floor?",
                    "Who controls the devices, and how will updates reach them?",
                ],
            },
            {
                type: "paragraph",
                text: "Field work with intermittent connectivity points toward mobile with offline support. Hardware integration and large local datasets point toward desktop. A wide, varied audience points toward web.",
            },
            { type: "heading", level: 2, text: "Combining platforms deliberately" },
            {
                type: "paragraph",
                text: "Many products end up on more than one platform. The useful question is which platform the first release needs and how shared services, APIs and design systems keep later platforms consistent rather than duplicated.",
            },
        ],
    },
    {
        slug: "what-launch-support-should-include",
        title: "What launch support should include",
        excerpt:
            "The weeks after a release are where software earns trust. Support arrangements agreed before go-live make that period calm instead of reactive.",
        status: "published",
        publishedAt: "2026-05-06",
        author,
        categories: ["Process", "Operations"],
        body: [
            {
                type: "paragraph",
                text: "A launch is a change in who depends on the software. Before it, the team building the system is the main user. After it, customers and colleagues are, and their expectations are different.",
            },
            { type: "heading", level: 2, text: "Agree these before release" },
            {
                type: "list",
                items: [
                    "Monitoring and alerting with named people who respond.",
                    "A response arrangement that states hours, channels and priorities.",
                    "A documented rollback path for the first releases.",
                    "An operations handbook that someone other than the original team can follow.",
                ],
            },
            {
                type: "paragraph",
                text: "These arrangements are not complicated, and most of them are produced naturally by a team that has been testing and deploying continuously through development.",
            },
            { type: "heading", level: 2, text: "From support to improvement" },
            {
                type: "paragraph",
                text: "Once the first weeks are stable, support becomes a source of insight. Issues, questions and usage patterns show where the next improvements belong, and a standing arrangement makes acting on them straightforward.",
            },
        ],
    },
    {
        slug: "draft-measuring-engineering-outcomes",
        title: "Measuring engineering outcomes",
        excerpt: "Working notes on connecting delivery metrics to business results.",
        status: "draft",
        publishedAt: "2026-06-01",
        author,
        categories: ["Engineering"],
        body: [{ type: "paragraph", text: "Draft content. Not for publication." }],
    },
];

export function getPublishedArticles(): Article[] {
    return articles
        .filter((article) => article.status === "published")
        .sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
}

export function getPublishedArticleBySlug(slug: string): Article | undefined {
    return getPublishedArticles().find((article) => article.slug === slug);
}

export function getRelatedArticles(article: Article, limit = 2): Article[] {
    const published = getPublishedArticles().filter((candidate) => candidate.slug !== article.slug);
    const sharesCategory = published.filter((candidate) =>
        candidate.categories.some((category) => article.categories.includes(category)),
    );
    const rest = published.filter((candidate) => !sharesCategory.includes(candidate));
    return [...sharesCategory, ...rest].slice(0, limit);
}
