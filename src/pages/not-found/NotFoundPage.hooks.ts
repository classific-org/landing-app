import { useLocation } from "react-router";
import { primaryNavigation } from "@/data/navigation";
import type { NavItem } from "@/types/content";

export type NotFoundViewModel = {
    pathname: string;
    suggestions: NavItem[];
};

export function useNotFoundPage(): NotFoundViewModel {
    const { pathname } = useLocation();
    return { pathname, suggestions: primaryNavigation };
}
