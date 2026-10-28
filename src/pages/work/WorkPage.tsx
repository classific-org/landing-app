import { PageHero } from "@/components/layout/PageHero";
import { Fold } from "@/components/layout/Fold";
import { ClosingCta } from "@/components/layout/ClosingCta";
import { ThreadedPage } from "@/components/layout/ThreadedPage";
import { Reveal } from "@/components/motion/Reveal";
import { ProjectGrid } from "@/components/projects/ProjectGrid";
import { ProjectFilter } from "@/components/projects/ProjectFilter";
import { TextLink } from "@/components/ui/TextLink";
import { useWorkPage } from "@/pages/work/WorkPage.hooks";

export function WorkPage() {
    const {
        projects,
        categories,
        activeCategory,
        showFilters,
        breadcrumbs,
        setCategory,
        hasProjects,
    } = useWorkPage();

    return (
        <ThreadedPage>
            <PageHero
                eyebrow="Work"
                title="Selected projects."
                copy={
                    hasProjects
                        ? "Case studies from recent engagements across web, mobile, desktop and business systems. Every outcome shown has been verified with the client."
                        : "Case studies are published only with verified outcomes and client approval. Until the first is approved, this page explains what you can expect to see here."
                }
                breadcrumbs={breadcrumbs}
                thread
            />

            <Fold
                tone="paper"
                id="work-grid-title"
                index="01"
                label={hasProjects ? "Case studies" : "Published work"}
                word={hasProjects ? ["Case", "studies"] : ["Published", "work"]}
                wordSize={hasProjects ? 17 : 14}
                node
            >
                {showFilters ? (
                    <Reveal className="mt-10">
                        <ProjectFilter
                            categories={categories}
                            activeCategory={activeCategory}
                            onChange={setCategory}
                        />
                    </Reveal>
                ) : null}
                <div className="mt-14 lg:mt-20">
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
                    <Reveal className="mt-14 flex flex-wrap gap-x-8 gap-y-3">
                        <TextLink to="/services" variant="arrow">
                            Explore what we build
                        </TextLink>
                        <TextLink to="/process" variant="arrow">
                            How a project runs
                        </TextLink>
                    </Reveal>
                ) : null}
            </Fold>

            <ClosingCta
                headline="Have a project in mind?"
                copy="Describe the challenge and we will respond with questions and a proposed way forward."
                tangle
            />
        </ThreadedPage>
    );
}
