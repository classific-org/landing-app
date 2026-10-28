import type { Article } from "@/types/content";
import blogDiscoveryImg from "@/assets/blog/blog_discovery.jpg";
import blogPlatformsImg from "@/assets/blog/blog_platforms.jpg";
import blogLaunchImg from "@/assets/blog/blog_launch.jpg";
import blogArchitectureImg from "@/assets/blog/blog_architecture.jpg";

export type BlogPost = Omit<Article, "coverImage"> & {
    coverImage: string;
    readingTime: string;
    featured?: boolean;
    category: "Architecture" | "Engineering" | "Process" | "Strategy";
};

const author = { name: "Classific Engineering Team" };

export const blogPosts: BlogPost[] = [
    {
        slug: "what-discovery-actually-decides",
        title: "What discovery actually decides in software delivery",
        excerpt:
            "Discovery is often treated as a formality before the real work. In practice it decides the shape, cost and risk of everything that follows.",
        status: "published",
        publishedAt: "2026-03-12",
        readingTime: "4 min read",
        author,
        category: "Process",
        categories: ["Process", "Strategy"],
        coverImage: blogDiscoveryImg,
        featured: true,
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
        title: "Choosing between web, mobile and desktop surfaces",
        excerpt:
            "The platform question is answered too early in many projects. A short checklist keeps the decision tied to how the software will actually be used.",
        status: "published",
        publishedAt: "2026-02-28",
        readingTime: "6 min read",
        author,
        category: "Engineering",
        categories: ["Engineering", "Strategy"],
        coverImage: blogPlatformsImg,
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
        slug: "modern-software-architecture-for-growing-systems",
        title: "Modular architecture principles for long-term maintainability",
        excerpt:
            "How to structure services, domain boundaries, and data pipelines so your codebase remains adaptable as requirements multiply.",
        status: "published",
        publishedAt: "2026-02-14",
        readingTime: "5 min read",
        author,
        category: "Architecture",
        categories: ["Architecture", "Engineering"],
        coverImage: blogArchitectureImg,
        body: [
            {
                type: "paragraph",
                text: "Premature microservices complicate early development, but monolithic codebases without boundary contracts become painful to maintain. The answer is modular architecture built around business domains.",
            },
            { type: "heading", level: 2, text: "Core architectural tenets" },
            {
                type: "list",
                items: [
                    "Strict boundary isolation between operational domain modules.",
                    "Typed schemas for all internal events and external API boundaries.",
                    "Shared design system tokens decoupled from view templates.",
                    "Automated integration tests running against realistic ephemeral services.",
                ],
            },
            {
                type: "paragraph",
                text: "By designing clean interfaces from day one, components can be swapped, scaled, or extracted into standalone services without rewriting the foundation.",
            },
        ],
    },
    {
        slug: "what-launch-support-should-include",
        title: "What launch support and operational readiness should include",
        excerpt:
            "The weeks after a release are where software earns trust. Support arrangements agreed before go-live make that period calm instead of reactive.",
        status: "published",
        publishedAt: "2026-01-20",
        readingTime: "5 min read",
        author,
        category: "Strategy",
        categories: ["Process", "Operations"],
        coverImage: blogLaunchImg,
        body: [
            {
                type: "paragraph",
                text: "A launch is a change in who depends on the software. Before it, the team building the system is the main user. After it, customers and colleagues are, and their expectations are different.",
            },
            { type: "heading", level: 2, text: "Agree these before release" },
            {
                type: "list",
                items: [
                    "Who receives alerts and what triggers an escalation.",
                    "How quickly critical issues are acknowledged and by whom.",
                    "What telemetry is monitored during peak usage hours.",
                    "The schedule and rollback criteria for subsequent hotfixes.",
                ],
            },
            {
                type: "paragraph",
                text: "Clear ownership, verified rollback procedures and active monitoring convert a stressful launch into an orderly engineering milestone.",
            },
        ],
    },
];

export function getPublishedBlogPosts(): BlogPost[] {
    return blogPosts.filter((post) => post.status === "published");
}

export function findBlogPostBySlug(slug: string): BlogPost | undefined {
    return blogPosts.find((post) => post.slug === slug && post.status === "published");
}
