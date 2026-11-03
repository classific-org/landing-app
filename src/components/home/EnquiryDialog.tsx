import { useEffect, useRef, useState } from "react";
import { EnquiryForm } from "@/components/forms/EnquiryForm";
import { ropePath, type Point } from "@/lib/thread/coil";

const nextSteps = [
    "24-hour response time",
    "Principal engineer consultation",
    "Transparent scope & milestones",
];

/**
 * The enquiry form in a panel over the page, opened from the loose end of the page thread (see
 * ClosingScene). A native modal dialog: focus moves into it and back, Escape and the backdrop
 * close it, and the page behind does not scroll.
 *
 * Opened by pulling the thread, it is given the thread's points on screen (`from`): the same
 * line flies from where it was let go into a frame round the panel, the far end leading, and
 * the form appears inside it. Opened any other way, the frame simply traces itself round.
 */
export function EnquiryDialog({
    open,
    from,
    onClose,
}: {
    open: boolean;
    from: Point[] | null;
    onClose: () => void;
}) {
    const ref = useRef<HTMLDialogElement>(null);
    const panelRef = useRef<HTMLDivElement>(null);
    const lineRef = useRef<SVGPathElement>(null);
    const [phase, setPhase] = useState<"forming" | "open">("open");

    useEffect(() => {
        const dialog = ref.current;
        if (!dialog || typeof dialog.showModal !== "function") {
            return;
        }
        if (!open) {
            if (dialog.open) {
                dialog.close();
            }
            return;
        }
        const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        const forming = Boolean(from && from.length > 1 && !reduced);
        setPhase(forming ? "forming" : "open");
        // Set before the dialog is shown, so the panel never shows for a frame ahead of the
        // thread forming its frame (React would only apply the new phase after it opened).
        dialog.dataset.phase = forming ? "forming" : "open";
        dialog.dataset.formed = forming ? "thread" : "trace";
        if (!dialog.open) {
            dialog.showModal();
        }
        if (!forming || !from) {
            return;
        }
        let frame = 0;
        const panel = panelRef.current;
        const line = lineRef.current;
        if (!panel || !line) {
            return;
        }
        // One path for the thread to run along: the rope as it was let go, then a smooth curve
        // from its free end to the nearest point of the frame (the panel's edge, 7px out), then
        // once round the frame from there. The visible stretch of line slides forward along it:
        // its tail leaves the rope while its head races round the frame, so nothing twists.
        const rect = panel.getBoundingClientRect();
        const left = rect.left - 7;
        const top = rect.top - 7;
        const right = rect.right + 7;
        const bottom = rect.bottom + 7;
        const tip = from[from.length - 1]!;
        const before = from[Math.max(0, from.length - 4)]!;
        const clampX = Math.min(right, Math.max(left, tip.x));
        const clampY = Math.min(bottom, Math.max(top, tip.y));
        const edges = [
            { side: "left", d: Math.abs(tip.x - left), point: { x: left, y: clampY } },
            { side: "right", d: Math.abs(tip.x - right), point: { x: right, y: clampY } },
            { side: "top", d: Math.abs(tip.y - top), point: { x: clampX, y: top } },
            { side: "bottom", d: Math.abs(tip.y - bottom), point: { x: clampX, y: bottom } },
        ].sort((a, b) => a.d - b.d);
        const join = edges[0]!;
        const corners = {
            tl: `${left} ${top}`,
            tr: `${right} ${top}`,
            br: `${right} ${bottom}`,
            bl: `${left} ${bottom}`,
        };
        // Round the frame clockwise from the join, back to it.
        const loop = {
            left: [corners.tl, corners.tr, corners.br, corners.bl],
            top: [corners.tr, corners.br, corners.bl, corners.tl],
            right: [corners.br, corners.bl, corners.tl, corners.tr],
            bottom: [corners.bl, corners.tl, corners.tr, corners.br],
        }[join.side as "left" | "right" | "top" | "bottom"];
        // Arrive running along the frame, the way it then carries on round, not head-on.
        const [firstX, firstY] = loop[0]!.split(" ").map(Number) as [number, number];
        const along = {
            x: Math.sign(firstX - join.point.x),
            y: Math.sign(firstY - join.point.y),
        };
        const heading = { x: tip.x - before.x, y: tip.y - before.y };
        const size = Math.hypot(heading.x, heading.y) || 1;
        const reach = Math.max(60, Math.hypot(join.point.x - tip.x, join.point.y - tip.y) * 0.45);
        const connector = `C${tip.x + (heading.x / size) * reach} ${tip.y + (heading.y / size) * reach} ${join.point.x - along.x * reach} ${join.point.y - along.y * reach} ${join.point.x} ${join.point.y}`;
        const frameD = `M${join.point.x} ${join.point.y} L${loop.join(" L")} L${join.point.x} ${join.point.y}`;
        line.setAttribute("d", ropePath(from));
        const ropeLength = line.getTotalLength();
        line.setAttribute("d", `${ropePath(from)} ${connector} ${frameD.replace(/^M[^L]+/, "")}`);
        const total = line.getTotalLength();
        const frameStart = Math.max(ropeLength, total - 2 * (right - left + (bottom - top)));
        line.style.strokeDasharray = `${total} ${total}`;
        const begin = performance.now();
        const run = () => {
            const t = Math.min(1, (performance.now() - begin) / 1150);
            const eased = t < 0.5 ? 4 * t ** 3 : 1 - (-2 * t + 2) ** 3 / 2;
            // The visible stretch starts as the whole rope and ends as the whole frame.
            const tail = frameStart * eased;
            const head = ropeLength + (total - ropeLength) * eased;
            const length = Math.max(0.5, head - tail);
            line.style.strokeDasharray = `${length} ${total * 2}`;
            line.style.strokeDashoffset = String(-tail);
            if (t < 1) {
                frame = requestAnimationFrame(run);
            } else {
                setPhase("open");
            }
        };
        frame = requestAnimationFrame(run);
        return () => cancelAnimationFrame(frame);
    }, [open, from]);

    return (
        <dialog
            ref={ref}
            className="enquiry-dialog"
            data-phase={phase}
            data-formed={from ? "thread" : "trace"}
            aria-labelledby="enquiry-dialog-title"
            data-lenis-prevent
            onClose={onClose}
            onClick={(event) => {
                // The dialog fills the screen around its panel: a click outside the panel lands on
                // the dialog itself.
                if (event.target === event.currentTarget) {
                    onClose();
                }
            }}
        >
            <svg className="enquiry-dialog-thread" aria-hidden="true" focusable="false">
                <path ref={lineRef} />
            </svg>
            <div ref={panelRef} className="enquiry-dialog-panel">
                <svg className="enquiry-dialog-trace" aria-hidden="true" focusable="false">
                    <rect pathLength="100" />
                </svg>
                <div className="enquiry-dialog-body">
                    <div>
                        <p className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.14em] text-[#2f855a]">
                            <span
                                className="h-2 w-2 rounded-full bg-[#2fbf71]"
                                aria-hidden="true"
                            />
                            Connected · Classific
                        </p>
                        <h2 id="enquiry-dialog-title" className="enquiry-dialog-title">
                            Let's build
                            <br />
                            what's next.
                        </h2>
                        <p className="mt-6 max-w-sm text-body-lg text-body">
                            Tell us about the challenge in front of your business. A few sentences
                            is enough to start.
                        </p>
                        <ol className="mt-10 grid gap-3 border-t border-ink pt-5 font-mono text-[12px]">
                            {nextSteps.map((step, index) => (
                                <li key={step} className="flex gap-4">
                                    <span className="tabular-nums text-muted">0{index + 1}</span>
                                    {step}
                                </li>
                            ))}
                        </ol>
                    </div>
                    <div>
                        <EnquiryForm />
                    </div>
                </div>
                <button
                    type="button"
                    className="enquiry-dialog-close"
                    aria-label="Close the enquiry form"
                    onClick={onClose}
                >
                    <svg viewBox="0 0 20 20" aria-hidden="true" focusable="false">
                        <path d="M5 5 L15 15 M15 5 L5 15" />
                    </svg>
                </button>
            </div>
        </dialog>
    );
}
