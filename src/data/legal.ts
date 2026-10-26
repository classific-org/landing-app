import type { LegalDocument } from "@/types/content";

export const legalReviewNotice =
    "This page is a structured draft prepared for review. It has not been reviewed by legal counsel and should not be relied on as legal advice until Classific confirms the final text.";

export const legalDocuments: LegalDocument[] = [
    {
        slug: "privacy",
        title: "Privacy Policy",
        intro: "This policy describes how Classific handles personal information collected through this website.",
        sections: [
            {
                heading: "Information we collect",
                paragraphs: [
                    "When you submit the project enquiry form we collect the details you provide: your name, business email address, company name if given, the service you are interested in, an optional budget range and your project description.",
                    "The website does not use advertising trackers. Standard technical information such as IP address and browser type may be processed by the hosting provider to deliver the site securely.",
                ],
            },
            {
                heading: "How we use information",
                paragraphs: [
                    "Enquiry details are used to respond to your request, assess fit and, where appropriate, prepare a proposal. We do not sell personal information and we do not add enquiry contacts to marketing lists without explicit consent.",
                ],
            },
            {
                heading: "Retention",
                paragraphs: [
                    "Enquiry records are kept for as long as needed to respond and to maintain a record of business correspondence. The specific retention period will be confirmed in the final policy.",
                ],
                needsReview: true,
            },
            {
                heading: "Third parties and processors",
                paragraphs: [
                    "Enquiries may be processed by the service provider that delivers form submissions and by our email provider. The identity of these processors and the jurisdictions involved will be listed in the final policy.",
                ],
                needsReview: true,
            },
            {
                heading: "Your rights",
                paragraphs: [
                    "Depending on where you are located you may have rights to access, correct or delete personal information we hold about you. Requests can be made using the contact details published on this website once confirmed.",
                ],
                needsReview: true,
            },
            {
                heading: "Changes to this policy",
                paragraphs: [
                    "We will update this page when our practices change and record the date of the latest revision here.",
                ],
            },
        ],
        seo: {
            title: "Privacy Policy",
            description:
                "How Classific collects, uses and protects personal information submitted through this website.",
        },
    },
    {
        slug: "terms",
        title: "Terms of Service",
        intro: "These terms govern use of the Classific website. Engagement terms for software development work are agreed separately in writing.",
        sections: [
            {
                heading: "Use of this website",
                paragraphs: [
                    "The content on this website is provided for general information about Classific and its services. You may browse the site and submit enquiries for legitimate business purposes.",
                ],
            },
            {
                heading: "Intellectual property",
                paragraphs: [
                    "Text, design and code on this website belong to Classific or its licensors unless otherwise stated. Case-study material is published with the permission of the clients involved.",
                ],
            },
            {
                heading: "Enquiries and proposals",
                paragraphs: [
                    "Submitting an enquiry does not create a contract. Any proposal, estimate or statement of work becomes binding only when both parties sign an engagement agreement.",
                ],
            },
            {
                heading: "Limitation of liability",
                paragraphs: [
                    "Information on this website is provided without warranty of completeness or fitness for a particular purpose. The scope of any limitation will be confirmed in the final terms in line with applicable law.",
                ],
                needsReview: true,
            },
            {
                heading: "Governing law",
                paragraphs: [
                    "The governing law and jurisdiction for these terms will be stated here once confirmed.",
                ],
                needsReview: true,
            },
        ],
        seo: {
            title: "Terms of Service",
            description: "Terms governing use of the Classific website and how enquiries are handled.",
        },
    },
];

export function getLegalDocument(slug: string): LegalDocument | undefined {
    return legalDocuments.find((document) => document.slug === slug);
}
