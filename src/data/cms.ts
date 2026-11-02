import type { BlogPost } from "@/data/blog";
import type { Project } from "@/types/content";

/** What scripts/fetch-cms.mjs writes: published content, already in the site's own shapes. */
export type CmsContent = {
    fetchedAt: string;
    blogs: BlogPost[];
    projects: Project[];
};

const files = import.meta.glob<CmsContent>("./generated/cms.json", {
    eager: true,
    import: "default",
});

/**
 * Published blogs and projects pulled from the CMS at build time, or null when the site was built
 * without a CMS (CMS_API_URL unset), in which case the bundled content is used. Unit tests always
 * use the bundled content so they do not depend on whatever was last pulled.
 */
export const cmsContent: CmsContent | null =
    import.meta.env.MODE === "test" ? null : (Object.values(files)[0] ?? null);
