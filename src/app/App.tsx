import type { HeadController } from "@sometic/head";
import { HeadProvider } from "@sometic/react/head";

type AppProps = {
    headController: HeadController;
    children: React.ReactNode;
    /** Disable DOM application during server rendering. */
    applyHead?: boolean;
};

export function App({ headController, children, applyHead = true }: AppProps) {
    return (
        <HeadProvider controller={headController} apply={applyHead}>
            {children}
        </HeadProvider>
    );
}
