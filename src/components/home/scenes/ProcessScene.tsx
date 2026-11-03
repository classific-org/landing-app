import { useEffect, useRef, useState } from "react";
import { stageArt } from "@/components/home/scenes/ProcessArt";
import type { ProcessStage } from "@/types/content";
import {
    Meta,
    Paper,
    Place,
    Port,
    Scene,
    SceneHeadline,
    Swap,
} from "@/components/services/worlds/World";

/**
 * Where each stage card sits, in order (x, y, width in % of the stage): one winding road, an
 * S that reads at a glance. 01 and 02 run across the top beside the headline, the road turns
 * down the right, and 03 to 05 run back right to left below it. The line never crosses itself.
 */
const layout = [
    { x: 51, y: 13, w: 19, rotate: 2 },
    { x: 76, y: 21, w: 19, rotate: -3 },
    { x: 72, y: 52, w: 19, rotate: 2 },
    { x: 44, y: 57, w: 19, rotate: -2 },
    { x: 16, y: 62, w: 19, rotate: 3 },
];

/**
 * A paper plane heading left, filled so it sits on top of the thread: the line runs into its
 * tail and out of its nose, so the plane carries the thread on to the next section.
 */
function PlaneArt() {
    return (
        <svg
            className="world-art plane-art -scale-x-100"
            viewBox="0 0 120 70"
            aria-hidden="true"
            focusable="false"
        >
            <path className="paper-fill" d="M34 40 L118 4 L84 64 L66 44 Z" />
            <path d="M118 4 L66 44 L62 62 L76 52" />
        </svg>
    );
}

/**
 * How far along the road the line is: a segment per stage, filling as each stage card lights.
 * Without a running thread (reduced motion, no script) every stage shows as done.
 */
function StageProgress({ total }: { total: number }) {
    const ref = useRef<HTMLDivElement>(null);
    const [done, setDone] = useState(total);

    useEffect(() => {
        const root = ref.current;
        const section = root?.closest("section");
        if (!root || !section || typeof MutationObserver === "undefined") {
            return;
        }
        const stages = Array.from(section.querySelectorAll<HTMLElement>(".process-stage"));
        const update = () => {
            const live = root.closest(".thread-live") !== null;
            setDone(
                live ? stages.filter((stage) => stage.dataset.threaded === "true").length : total,
            );
        };
        const observer = new MutationObserver(update);
        stages.forEach((stage) =>
            observer.observe(stage, { attributes: true, attributeFilter: ["data-threaded"] }),
        );
        // The page wrapper gains .thread-live once the thread is running.
        for (let node = root.parentElement; node; node = node.parentElement) {
            observer.observe(node, { attributes: true, attributeFilter: ["class"] });
        }
        update();
        return () => observer.disconnect();
    }, [total]);

    return (
        <div
            ref={ref}
            className="mt-8 flex items-center gap-4 font-mono text-[11px] uppercase tracking-[0.14em] text-body"
            aria-hidden="true"
        >
            <span className="flex gap-1.5">
                {Array.from({ length: total }, (_, index) => (
                    <span
                        key={index}
                        className={`stage-segment ${index < done ? "stage-segment-on" : ""}`}
                    />
                ))}
            </span>
            <span className="tabular-nums">
                Stage 0{Math.max(done, 1)} / 0{total}
            </span>
        </div>
    );
}

export function ProcessScene({ stages }: { stages: ProcessStage[] }) {
    return (
        <Scene
            id="process-title"
            anchor="process"
            tone="paper"
            exit="left"
            index="07"
            label="Process"
            description="Five stages, the same for every project. The depth of each one depends on the work."
            height="max(64rem, 120svh)"
        >
            <Place x="5%" y="17%" w="42%" still>
                <SceneHeadline
                    id="process-title"
                    lines={["A sequence", "you can follow."]}
                    size={5.2}
                />
                <p className="mt-6 max-w-sm text-body-lg text-body">
                    From the first conversation to launch, every stage ends in something you can
                    hold: a document, a prototype, working software.
                </p>
                <StageProgress total={Math.min(stages.length, layout.length)} />
            </Place>

            {stages.slice(0, layout.length).map((stage, index) => {
                const place = layout[index]!;
                const Art = stageArt[index];
                return (
                    <Place
                        key={stage.slug}
                        x={`${place.x}%`}
                        y={`${place.y}%`}
                        w={`${place.w}%`}
                        rotate={place.rotate}
                        className="process-stage"
                        scrub="scroll"
                    >
                        <Paper>
                            <Meta>Stage 0{stage.number}</Meta>
                            <p className="mt-2 text-[1.35rem] font-medium leading-tight">
                                {stage.title}
                            </p>
                            <p className="sr-only">{stage.summary}</p>
                            {/* The deliverable, drawn; it plays as the thread reaches the card. */}
                            {Art ? (
                                <div className="mt-4 text-ink">
                                    <Art />
                                </div>
                            ) : null}
                            {stage.deliverables[0] ? (
                                <p className="mt-4 border-t border-ink/15 pt-3 font-mono text-[10px] uppercase tracking-[0.08em]">
                                    <Swap
                                        before={<span className="text-muted">Deliverable</span>}
                                        after={
                                            <span className="world-accent">
                                                ✓ {stage.deliverables[0]}
                                            </span>
                                        }
                                    />
                                </p>
                            ) : null}
                        </Paper>
                        <Port order={index + 2} x="50%" y="50%" />
                    </Place>
                );
            })}

            {/* The plane is turned nose-down to the left, so the line leaves its nose already
                heading for the margin it drops down. The ports sit where its tail notch and
                nose land after that turn (worked out in the art's 120 x 70 box). */}
            <Place x="9%" y="83%" w="9%" className="plane hidden lg:block">
                <span className="block" style={{ transform: "rotate(-43deg)" }}>
                    <PlaneArt />
                </span>
                <Port order={7} x="68.9%" y="29.6%" />
                <Port order={8} x="-2.9%" y="74%" />
            </Place>

            {/* The line comes in between the kicker row and the headline, never behind text. */}
            <Port order={1} x="34%" y="12%" />
        </Scene>
    );
}
