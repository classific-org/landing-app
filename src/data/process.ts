import type { ProcessStage } from "@/types/content";

export const processStages: ProcessStage[] = [
    {
        number: 1,
        slug: "discover",
        title: "Discover",
        summary: "Understand the business problem before deciding what to build.",
        description:
            "We start with the people, workflows and constraints behind the request. Discovery surfaces the real goals, the systems already in place and the risks that shape the engineering approach.",
        activities: [
            "Stakeholder conversations and workflow walkthroughs",
            "Review of existing systems, data and integrations",
            "Definition of success criteria and constraints",
        ],
        deliverables: ["Written problem statement", "Scope boundaries and open questions"],
        clientProvides: ["Access to the people who own the workflow", "Existing documentation"],
    },
    {
        number: 2,
        slug: "plan",
        title: "Plan",
        summary: "Turn goals into a sequenced, estimated plan of work.",
        description:
            "Planning translates discovery into architecture decisions, a prioritised backlog and a delivery sequence that puts the most valuable and most uncertain work first.",
        activities: [
            "Architecture and technology selection",
            "Prioritised backlog and release sequencing",
            "Estimates with documented assumptions",
        ],
        deliverables: ["Solution outline", "Release plan with milestones"],
        clientProvides: ["Decisions on priorities and trade-offs"],
    },
    {
        number: 3,
        slug: "design",
        title: "Design",
        summary: "Shape the product around the people who will use it.",
        description:
            "Design covers information architecture, interaction flows and interface detail. We work in the real product where possible so decisions are tested against actual data and constraints.",
        activities: [
            "Flows and information architecture",
            "Interface design and component library",
            "Usability review with representative users",
        ],
        deliverables: ["Interactive prototypes", "Design system and specifications"],
        clientProvides: ["Access to representative users", "Brand assets and content"],
    },
    {
        number: 4,
        slug: "develop",
        title: "Develop",
        summary: "Build in short, reviewable increments with automated tests.",
        description:
            "Engineering proceeds in increments that are demonstrated regularly. Every increment is covered by automated tests, code review and continuous integration so quality is visible throughout.",
        activities: [
            "Incremental delivery with regular demos",
            "Automated testing and code review",
            "Integration with existing systems",
        ],
        deliverables: ["Working software in a staging environment", "Technical documentation"],
        clientProvides: ["Timely feedback on demos", "Access to systems being integrated"],
    },
    {
        number: 5,
        slug: "launch",
        title: "Launch",
        summary: "Release deliberately and support what ships.",
        description:
            "Launch includes release planning, monitoring, handover and the support arrangement that follows. We treat the first weeks in production as part of the project rather than an afterthought.",
        activities: [
            "Release checklist and rollout plan",
            "Monitoring, alerting and performance checks",
            "Handover, training and support arrangement",
        ],
        deliverables: ["Production release", "Operations handbook and support agreement"],
        clientProvides: ["Go-live approval", "Operational contacts"],
    },
];
