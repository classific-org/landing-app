import { useState } from "react";
import heroLaptop from "@/assets/home/hero_laptop.jpg";
import modularCubes from "@/assets/home/modular_software_cubes.jpg";
import floatingPanels from "@/assets/home/floating_ui_panels.jpg";
import blueRibbons from "@/assets/home/blue_glass_ribbons.jpg";

export type HeroPerspective = {
    id: "workstation" | "architecture" | "interfaces" | "systems";
    label: string;
    caption: string;
    badge: string;
    image: string;
    alt: string;
};

export const heroPerspectives: HeroPerspective[] = [
    {
        id: "workstation",
        label: "Production Build",
        caption: "Full-Stack Enterprise Applications",
        badge: "Production Ready • Scale Verified",
        image: heroLaptop,
        alt: "Classific software running on a precision workstation laptop",
    },
    {
        id: "architecture",
        label: "Modular Architecture",
        caption: "Decoupled Services & Clear Data Boundaries",
        badge: "Clean Architecture • High Maintainability",
        image: modularCubes,
        alt: "Modular software architecture cubes representing web, mobile and database systems",
    },
    {
        id: "interfaces",
        label: "Design Systems",
        caption: "Accessible, High-Density Interface Layers",
        badge: "WCAG 2.2 AA • Accessible UI",
        image: floatingPanels,
        alt: "Frosted layered user interface panels with live analytics and code",
    },
    {
        id: "systems",
        label: "Data Pipelines",
        caption: "Reliable APIs & Distributed Integrations",
        badge: "Continuous Delivery • Zero Drift",
        image: blueRibbons,
        alt: "Flowing precision glass ribbons symbolizing resilient system integrations",
    },
];

export function useHeroComposition() {
    const [activePerspectiveId, setActivePerspectiveId] =
        useState<HeroPerspective["id"]>("workstation");

    const activePerspective =
        heroPerspectives.find((p) => p.id === activePerspectiveId) ?? heroPerspectives[0];

    const selectPerspective = (id: HeroPerspective["id"]) => {
        setActivePerspectiveId(id);
    };

    return {
        perspectives: heroPerspectives,
        activePerspective,
        selectPerspective,
    };
}
