import type { Principle } from "@/types/content";

export const principles: Principle[] = [
    {
        title: "Business-focused engineering",
        description:
            "Every technical decision is traced back to a business outcome. We ask what a feature changes for the people using it before deciding how to build it.",
        icon: "workflow",
    },
    {
        title: "Modern technology, chosen carefully",
        description:
            "We use current, well-supported platforms and avoid novelty for its own sake. The stack is chosen to fit the problem, the team that will maintain it and the time horizon of the product.",
        icon: "code",
    },
    {
        title: "Long-term partnership",
        description:
            "Software keeps changing after launch. We structure engagements so the relationship, the documentation and the codebase all survive the first release.",
        icon: "layers",
    },
    {
        title: "Dependable support",
        description:
            "Clear ownership, monitoring and response arrangements are agreed before go-live, so issues are handled by people who know the system.",
        icon: "shield-check",
    },
];

export const capabilities: string[] = [
    "Web application development",
    "Mobile application development",
    "Desktop application development",
    "CRM, CMS and ERP systems",
    "Custom software and integrations",
];
