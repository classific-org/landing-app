import { Container } from "@/components/layout/Container";
import { Eyebrow } from "@/components/layout/Eyebrow";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import type { Breadcrumb } from "@/content/routes";

type PageHeroProps = {
    eyebrow: string;
    title: string;
    copy?: string;
    breadcrumbs?: Breadcrumb[];
    children?: React.ReactNode;
    aside?: React.ReactNode;
};

export function PageHero({ eyebrow, title, copy, breadcrumbs, children, aside }: PageHeroProps) {
    return (
        <section
            aria-labelledby="page-title"
            className="relative overflow-hidden border-b border-rule bg-paper"
        >
            {/* Blueprint Grid Texture */}
            <div
                className="pointer-events-none absolute inset-0 grid-blueprint opacity-45"
                aria-hidden="true"
            />

            <Container className="relative py-14 lg:py-24">
                {breadcrumbs ? (
                    <div className="mb-8">
                        <Breadcrumbs items={breadcrumbs} />
                    </div>
                ) : null}
                <div className="grid gap-10 lg:grid-cols-12 lg:gap-8">
                    <div className="lg:col-span-8">
                        <div className="flex items-center gap-2 mb-5">
                            <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                            <Eyebrow>{eyebrow}</Eyebrow>
                        </div>
                        <h1 id="page-title" className="text-h1 leading-tight tracking-tight">
                            {title}
                        </h1>
                        {copy ? (
                            <p className="mt-8 max-w-2xl text-body-lg text-body leading-relaxed">
                                {copy}
                            </p>
                        ) : null}
                        {children}
                    </div>
                    {aside ? (
                        <div className="lg:col-span-3 lg:col-start-10 lg:self-end">{aside}</div>
                    ) : null}
                </div>
            </Container>
        </section>
    );
}
