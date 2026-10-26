import { useParams } from "react-router";
import { getLegalDocument, legalReviewNotice } from "@/data/legal";
import { findPublicRoute } from "@/content/routes";
import type { Breadcrumb } from "@/content/routes";
import type { LegalDocument } from "@/types/content";

export type LegalPageViewModel =
    | { status: "missing" }
    | {
          status: "ready";
          document: LegalDocument;
          reviewNotice: string;
          breadcrumbs: Breadcrumb[];
          needsReviewCount: number;
      };

export function resolveLegalPage(slug: string | undefined): LegalPageViewModel {
    const document = slug ? getLegalDocument(slug) : undefined;
    if (!document) {
        return { status: "missing" };
    }
    return {
        status: "ready",
        document,
        reviewNotice: legalReviewNotice,
        breadcrumbs: findPublicRoute(`/${document.slug}`)?.breadcrumbs ?? [],
        needsReviewCount: document.sections.filter((section) => section.needsReview).length,
    };
}

export function useLegalPage(): LegalPageViewModel {
    const { legalSlug } = useParams<{ legalSlug: string }>();
    return resolveLegalPage(legalSlug);
}
