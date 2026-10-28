import type { ReactNode } from "react";
import { PageThread } from "@/components/home/PageThread";

/**
 * Wraps a page whose direct children are full-width sections (a hero, folds and a closing
 * call to action) so the blue thread can run through them.
 */
export function ThreadedPage({ children }: { children: ReactNode }) {
    return (
        <div className="relative overflow-x-clip">
            <PageThread />
            {children}
        </div>
    );
}
