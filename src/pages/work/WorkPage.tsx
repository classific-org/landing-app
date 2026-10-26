import { PageHero } from "@/components/layout/PageHero";
import { Section } from "@/components/layout/Section";
import { ClosingCta } from "@/components/layout/ClosingCta";
import { ProjectGrid } from "@/components/projects/ProjectGrid";
import { ProjectFilter } from "@/components/projects/ProjectFilter";
import { TextLink } from "@/components/ui/TextLink";
import { useWorkPage } from "@/pages/work/WorkPage.hooks";

export function WorkPage() {
    const { projects, categories, activeCategory, showFilters, breadcrumbs, setCategory, hasProjects } =
        useWorkPage();

    return (
        <>
            <PageHero
                eyebrow="Work"
                title="Selected projects."
                copy={
                    hasProjects
                        ? "Case studies from recent engagements across web, mobile, desktop and business systems. Every outcome shown has been verified with the client."
                        : "Case studies are published only with verified outcomes and client approval. Until the first is approved, this page explains what you can expect to see here."
                }
                breadcrumbs={breadcrumbs}
            />

            <Section labelledBy="work-grid-title" tone="white">
                <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
                    <h2 id="work-grid-title" className="text-h2">
                        {hasProjects ? "Case studies" : "Published work"}
                    </h2>
                    {showFilters ? (
                        <ProjectFilter
                            categories={categories}
                            activeCategory={activeCategory}
                            onChange={setCategory}
                        />
                    ) : null}
                </div>
                <div className="mt-12">
                    <ProjectGrid
                        projects={projects}
                        emptyTitle={
                            hasProjects
                                ? "No projects match this filter."
                                : "No published projects yet."
                        }
                        emptyCopy={
                            hasProjects
                                ? "Choose another category or view all projects."
                                : "Each case study will describe the business challenge, our approach, the solution and verified outcomes, with imagery from the real product. Nothing is published before the client approves it."
                        }
                    />
                </div>
                {!hasProjects ? (
                    <div className="mt-10 flex flex-wrap gap-x-8 gap-y-3">
                        <TextLink to="/services" variant="arrow">
                            Explore what we build
                        </TextLink>
                        <TextLink to="/process" variant="arrow">
                            How a project runs
                        </TextLink>
                    </div>
                ) : null}
            </Section>

            <ClosingCta
                headline="Have a project in mind?"
                copy="Describe the challenge and we will respond with questions and a proposed way forward."
            />
        </>
    );
}
