import type { Service, ServiceSlug } from "@/types/content";

export const services: Service[] = [
    {
        slug: "web-applications",
        title: "Web Applications",
        navLabel: "Web Applications",
        icon: "monitor",
        summary: "Browser-based products and internal tools built for daily use at scale.",
        description:
            "From customer-facing platforms to internal operations tools, we build web applications that are fast, secure and straightforward to maintain. Each one is designed around the workflows it supports rather than a generic template.",
        hero: {
            eyebrow: "Web applications",
            headline: "Web software that holds up to daily use.",
            copy: "We design and build browser-based products, portals and operational tools that your customers and teams rely on every day. Performance, accessibility and maintainability are treated as requirements, not finishing touches.",
        },
        problems: [
            "Spreadsheets and email threads are carrying processes that need a real system.",
            "An existing web product is slow, hard to change or difficult to secure.",
            "Customers need a self-service portal connected to your back-office data.",
            "A new product idea needs a credible first release without an oversized build.",
        ],
        capabilities: [
            {
                title: "Product and platform development",
                description:
                    "Customer-facing applications, SaaS products and multi-tenant platforms with clear data boundaries.",
            },
            {
                title: "Internal tools and portals",
                description:
                    "Operational dashboards, admin tools and partner portals that replace manual coordination.",
            },
            {
                title: "Modernisation",
                description:
                    "Incremental rebuilds of legacy web systems that keep the business running during the transition.",
            },
            {
                title: "Performance and accessibility",
                description:
                    "Core Web Vitals, WCAG conformance and responsive layouts handled as part of the build.",
            },
        ],
        useCases: [
            "Customer portals with account, billing and support views",
            "Booking, scheduling and reservation systems",
            "Operations dashboards with role-based access",
            "Marketplace and multi-vendor platforms",
        ],
        deliverables: [
            "Production web application with automated tests",
            "Design system and component library",
            "Deployment pipeline and environment documentation",
            "Technical handover and operations guide",
        ],
        faqs: [
            {
                question: "Which technologies do you use for web applications?",
                answer: "We select the stack per project. Typical choices include TypeScript, React and modern server frameworks with managed cloud infrastructure. The decision is documented with its trade-offs during planning.",
            },
            {
                question: "Can you work with our existing web application?",
                answer: "Yes. We regularly take on existing codebases, starting with an assessment of architecture, test coverage and deployment practice before proposing a modernisation path.",
            },
            {
                question: "How do you approach accessibility?",
                answer: "Accessibility is part of the definition of done. We build with semantic HTML, test keyboard navigation and screen reader behaviour, and target WCAG 2.2 AA.",
            },
        ],
        relatedServices: ["custom-software", "crm-cms-erp"],
        seo: {
            title: "Web Application Development",
            description:
                "Classific designs and builds web applications, portals and internal tools that are fast, accessible and maintainable for long-term business use.",
        },
    },
    {
        slug: "mobile-applications",
        title: "Mobile Applications",
        navLabel: "Mobile Applications",
        icon: "smartphone",
        summary: "iOS and Android applications connected to the systems behind them.",
        description:
            "We build mobile applications for customers and field teams, with the back-end services, offline behaviour and release processes they depend on. The platform approach is chosen for the product, not by default.",
        hero: {
            eyebrow: "Mobile applications",
            headline: "Mobile products connected to the business behind them.",
            copy: "We design and build iOS and Android applications alongside the APIs, authentication and data services they depend on, so the app works as part of your operation rather than in isolation.",
        },
        problems: [
            "Field teams rely on paper or phone calls to record work on site.",
            "Customers expect a mobile experience that matches your web product.",
            "An existing app has fallen behind platform requirements or store policies.",
            "Offline use, sync and device capabilities need careful engineering.",
        ],
        capabilities: [
            {
                title: "Native and cross-platform development",
                description:
                    "Platform choice based on product requirements, team skills and long-term cost, documented in planning.",
            },
            {
                title: "Back-end and API services",
                description:
                    "Authentication, data synchronisation and push notification services designed for mobile clients.",
            },
            {
                title: "Offline and field workflows",
                description:
                    "Local storage, conflict handling and background sync for use in low-connectivity environments.",
            },
            {
                title: "Release and store management",
                description:
                    "Build pipelines, beta distribution and app store submission handled as part of delivery.",
            },
        ],
        useCases: [
            "Field service and inspection applications",
            "Customer self-service companions to a web platform",
            "Internal approval and reporting apps",
            "Loyalty, ordering and appointment applications",
        ],
        deliverables: [
            "Published iOS and Android applications",
            "Back-end services and API documentation",
            "Automated build and release pipeline",
            "Device and OS compatibility matrix",
        ],
        faqs: [
            {
                question: "Do you build native or cross-platform apps?",
                answer: "Both. We recommend an approach after understanding device features, performance needs and how the app will be maintained. The recommendation and its reasoning are written down before development starts.",
            },
            {
                question: "Do you handle app store submission?",
                answer: "Yes. Store accounts remain in your name and we manage builds, metadata and review feedback with you.",
            },
            {
                question: "Can the app work without a connection?",
                answer: "Offline behaviour is a design decision made early. Where it is needed we build local storage, queued changes and sync logic with clear conflict rules.",
            },
        ],
        relatedServices: ["web-applications", "custom-software"],
        seo: {
            title: "Mobile Application Development",
            description:
                "Classific builds iOS and Android applications with the back-end services, offline behaviour and release pipelines that connect them to your business.",
        },
    },
    {
        slug: "desktop-applications",
        title: "Desktop Applications",
        navLabel: "Desktop Applications",
        icon: "app-window",
        summary: "Windows, macOS and Linux software for demanding professional workflows.",
        description:
            "Some work still belongs on the desktop: hardware integration, large local datasets, specialised tooling and environments without reliable connectivity. We build desktop software that fits those constraints.",
        hero: {
            eyebrow: "Desktop applications",
            headline: "Desktop software for work that needs the machine.",
            copy: "We build cross-platform and native desktop applications for professional, industrial and operational environments, where hardware access, local processing and controlled deployment matter.",
        },
        problems: [
            "Specialist tools need direct access to devices, files or local hardware.",
            "Work happens in environments where a browser-based tool is impractical.",
            "A legacy desktop application needs replacing without disrupting operations.",
            "Large datasets must be processed locally for speed or compliance.",
        ],
        capabilities: [
            {
                title: "Cross-platform desktop development",
                description:
                    "Applications that run on Windows, macOS and Linux from a shared, maintainable codebase.",
            },
            {
                title: "Hardware and peripheral integration",
                description:
                    "Integration with scanners, sensors, printers, serial and USB devices.",
            },
            {
                title: "Local data and performance",
                description:
                    "Embedded databases, file processing and background work tuned for the desktop.",
            },
            {
                title: "Packaging and deployment",
                description:
                    "Installers, code signing, auto-update and managed rollout for controlled environments.",
            },
        ],
        useCases: [
            "Laboratory, workshop and production-floor tooling",
            "Point-of-sale and kiosk software",
            "Data processing and reporting workstations",
            "Replacement of legacy line-of-business desktop systems",
        ],
        deliverables: [
            "Signed installers for each target platform",
            "Update and distribution mechanism",
            "Hardware integration documentation",
            "Support and maintenance plan",
        ],
        faqs: [
            {
                question: "Which platforms do you support?",
                answer: "Windows, macOS and Linux. We advise on the platform mix once we understand your users and the hardware involved.",
            },
            {
                question: "Can a desktop application also sync with our web systems?",
                answer: "Yes. Most desktop projects include APIs or sync services so the desktop software remains part of a connected system.",
            },
            {
                question: "How are updates delivered?",
                answer: "We build an update mechanism suited to your environment, from automatic updates to managed rollout through IT administration tooling.",
            },
        ],
        relatedServices: ["custom-software", "web-applications"],
        seo: {
            title: "Desktop Application Development",
            description:
                "Classific builds Windows, macOS and Linux desktop applications for professional and industrial workflows, including hardware integration and managed deployment.",
        },
    },
    {
        slug: "crm-cms-erp",
        title: "CRM, CMS & ERP",
        navLabel: "CRM, CMS & ERP",
        icon: "layers",
        summary: "Business systems shaped around how your organisation actually works.",
        description:
            "We build and extend the systems that run a business: customer relationship management, content management and resource planning. Where an existing platform fits we integrate and extend it; where it does not, we build what is missing.",
        hero: {
            eyebrow: "CRM, CMS and ERP",
            headline: "Business systems that fit the business.",
            copy: "We design, build and integrate CRM, CMS and ERP systems so your customer, content and operational data work together, with the workflows your teams recognise rather than ones imposed by a generic package.",
        },
        problems: [
            "Customer information is spread across tools that do not talk to each other.",
            "Content publishing depends on a developer for every change.",
            "Off-the-shelf ERP modules force workarounds in day-to-day operations.",
            "Reporting requires manual export and reconciliation across systems.",
        ],
        capabilities: [
            {
                title: "Custom CRM development",
                description:
                    "Pipeline, account and service management built around your sales and support processes.",
            },
            {
                title: "Content management systems",
                description:
                    "Structured content models, editorial workflows and headless delivery to web and mobile.",
            },
            {
                title: "ERP and operations systems",
                description:
                    "Inventory, orders, scheduling and finance workflows with integration to existing accounting tools.",
            },
            {
                title: "Integration and migration",
                description:
                    "Data migration, API integration and phased rollout alongside systems you keep.",
            },
        ],
        useCases: [
            "Sales and account management platforms",
            "Editorial and multi-site content systems",
            "Inventory, procurement and order management",
            "Service scheduling and resource planning",
        ],
        deliverables: [
            "Configured or custom-built business system",
            "Data migration with validation reports",
            "Integration layer and API documentation",
            "Administrator and user training material",
        ],
        faqs: [
            {
                question: "Do you build from scratch or configure existing platforms?",
                answer: "Either, depending on fit. During discovery we assess existing platforms against your workflows and recommend building, extending or integrating, with the reasoning documented.",
            },
            {
                question: "How do you handle data migration?",
                answer: "Migration is planned as its own workstream with mapping documents, rehearsal runs and validation reports before cut-over.",
            },
            {
                question: "Can the system integrate with our accounting software?",
                answer: "Yes. Integration with finance, payment and communication tools is a common part of these projects and is scoped during planning.",
            },
        ],
        relatedServices: ["web-applications", "custom-software"],
        seo: {
            title: "CRM, CMS and ERP Development",
            description:
                "Classific designs, builds and integrates CRM, CMS and ERP systems shaped around your organisation's workflows, data and existing tools.",
        },
    },
    {
        slug: "custom-software",
        title: "Custom Software Solutions",
        navLabel: "Custom Software",
        icon: "code",
        summary: "Purpose-built systems, APIs and integrations when standard products fall short.",
        description:
            "When the problem does not match an existing product, we design and build software to fit it: APIs, integration layers, automation, data pipelines and the specialised systems that give a business its edge.",
        hero: {
            eyebrow: "Custom software",
            headline: "Software built for the problem in front of you.",
            copy: "We design and engineer custom systems, APIs and integrations when off-the-shelf products would force compromises. The result is software that reflects how your business works and can evolve as it changes.",
        },
        problems: [
            "No existing product covers the process that differentiates your business.",
            "Several systems need to exchange data reliably and automatically.",
            "Manual, repetitive work could be automated with the right tooling.",
            "A proof of concept needs to become dependable production software.",
        ],
        capabilities: [
            {
                title: "API design and development",
                description:
                    "Well-documented, versioned APIs for partners, internal teams and product front-ends.",
            },
            {
                title: "System integration",
                description:
                    "Reliable data exchange between existing platforms with monitoring and error handling.",
            },
            {
                title: "Automation and data pipelines",
                description:
                    "Scheduled and event-driven processing that removes manual steps and reconciliation.",
            },
            {
                title: "Specialised business systems",
                description:
                    "Domain-specific applications designed with the experts who understand the problem.",
            },
        ],
        useCases: [
            "Partner and public APIs",
            "Integration between CRM, finance and operations systems",
            "Document processing and workflow automation",
            "Industry-specific calculation and planning tools",
        ],
        deliverables: [
            "Production system with automated tests and monitoring",
            "API documentation and integration guides",
            "Architecture decision records",
            "Maintenance and support arrangement",
        ],
        faqs: [
            {
                question: "How do you decide between custom software and an existing product?",
                answer: "We assess fit, total cost and the strategic value of the capability during discovery. Custom development is recommended only where it provides a clear advantage.",
            },
            {
                question: "Who owns the code?",
                answer: "You do. Intellectual property arrangements are set out in the engagement agreement, and the codebase, documentation and infrastructure configuration are handed over.",
            },
            {
                question: "What happens after launch?",
                answer: "We agree a support and maintenance arrangement before go-live that covers monitoring, response and ongoing improvement.",
            },
        ],
        relatedServices: ["web-applications", "crm-cms-erp"],
        seo: {
            title: "Custom Software Development",
            description:
                "Classific designs and builds custom software, APIs, integrations and automation when standard products cannot support the way your business works.",
        },
    },
];

const serviceIndex = new Map<ServiceSlug, Service>(
    services.map((service) => [service.slug, service]),
);

export function getServiceBySlug(slug: string): Service | undefined {
    return serviceIndex.get(slug as ServiceSlug);
}

export function getRelatedServices(service: Service): Service[] {
    return service.relatedServices
        .map((slug) => serviceIndex.get(slug))
        .filter((related): related is Service => related !== undefined);
}
