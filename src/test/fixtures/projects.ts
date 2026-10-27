import type { Project } from "@/types/content";

export const publishedWebProject: Project = {
    slug: "operations-portal",
    title: "Operations portal",
    category: "Web",
    status: "published",
    summary: "An internal portal that replaced spreadsheet-led coordination.",
    description: "A browser-based operations portal for a growing services business.",
    challenge: "Teams coordinated work in shared spreadsheets that could not keep up.",
    approach: "Discovery mapped the actual workflow before any interface work began.",
    solution: "A role-based portal with a shared data model and audit history.",
    technologies: ["TypeScript", "React"],
    services: ["web-applications"],
    publishedAt: "2026-01-12",
    outcomes: [
        {
            label: "Manual status updates",
            value: "Removed from the weekly process",
            verified: true,
        },
    ],
};

export const publishedMobileProject: Project = {
    slug: "field-companion",
    title: "Field companion",
    category: "Mobile",
    status: "published",
    summary: "A mobile companion for technicians working away from a desk.",
    description: "Offline-capable mobile software for field teams.",
    challenge: "Technicians needed job details without a reliable connection.",
    approach: "We designed for intermittent connectivity first.",
    solution: "A native-feeling mobile application with a local queue.",
    technologies: ["TypeScript"],
    services: ["mobile-applications", "web-applications"],
    publishedAt: "2026-03-02",
};

export const draftProject: Project = {
    slug: "draft-internal-tool",
    title: "Internal tool draft",
    category: "Web",
    status: "draft",
    summary: "Not ready for publication.",
    description: "Draft only.",
    challenge: "Draft.",
    approach: "Draft.",
    solution: "Draft.",
    technologies: ["TypeScript"],
    services: ["web-applications"],
};

export const publishedProjectFixtures: Project[] = [publishedWebProject, publishedMobileProject];
