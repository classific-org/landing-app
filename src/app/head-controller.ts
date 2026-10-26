import { createHeadController, type HeadController } from "@sometic/head";
import { buildBaseHeadPatch } from "@/lib/seo/head";

export function createSiteHeadController(): HeadController {
    return createHeadController({ initial: buildBaseHeadPatch() });
}
