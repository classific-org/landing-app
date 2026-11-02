import type { Service } from "@/types/content";
import { CustomWorld } from "@/components/services/worlds/CustomWorld";
import { DesktopWorld } from "@/components/services/worlds/DesktopWorld";
import { MobileWorld } from "@/components/services/worlds/MobileWorld";
import { SystemsWorld } from "@/components/services/worlds/SystemsWorld";
import { WebWorld } from "@/components/services/worlds/WebWorld";

/**
 * The five services as full-screen worlds the page thread runs through. Rendered as sibling
 * sections, so place it directly inside the threaded page wrapper.
 */
export function ServiceWorlds({ services }: { services: Service[] }) {
    const bySlug = (slug: string) => {
        const service = services.find((item) => item.slug === slug);
        return { description: service?.summary ?? "", href: `/services/${slug}` };
    };
    return (
        <>
            <WebWorld {...bySlug("web-applications")} />
            <MobileWorld {...bySlug("mobile-applications")} />
            <DesktopWorld {...bySlug("desktop-applications")} />
            <SystemsWorld {...bySlug("crm-cms-erp")} />
            <CustomWorld {...bySlug("custom-software")} />
        </>
    );
}
