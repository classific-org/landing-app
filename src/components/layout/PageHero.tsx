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
        <section aria-labelledby="page-title" className="border-b border-rule bg-paper">
            <Container className="py-14 lg:py-24">
                {breadcrumbs ? (
                    <div className="mb-8">
                        <Breadcrumbs items={breadcrumbs} />
                    </div>
                ) : null}
                <div className="grid gap-10 lg:grid-cols-12 lg:gap-8">
                    <div className="lg:col-span-8">
                        <Eyebrow className="mb-5">{eyebrow}</Eyebrow>
                        <h1 id="page-title" className="text-h1">
                            {title}
                        </h1>
                        {copy ? <p className="mt-8 max-w-2xl text-body-lg text-body">{copy}</p> : null}
                        {children}
                    </div>
                    {aside ? <div className="lg:col-span-3 lg:col-start-10 lg:self-end">{aside}</div> : null}
                </div>
            </Container>
        </section>
    );
}
