import { useEffect, useRef } from "react";

/*
 * Finishing touches after the reference site, for a mouse or trackpad only (never on touch,
 * never with reduced motion):
 *
 * a disc in the thread's blue that eases after the pointer. It is not shown at rest (the
 * native cursor does the work); over anything marked `data-cursor="LABEL"` it grows into a
 * disc carrying that word (VIEW, TALK, PULL) and the native cursor steps aside, and over other
 * links and buttons it swells softly.
 */
export function CustomCursor() {
    const ref = useRef<HTMLDivElement>(null);
    const labelRef = useRef<HTMLSpanElement>(null);

    useEffect(() => {
        const cursor = ref.current;
        const label = labelRef.current;
        if (!cursor || !label) {
            return;
        }
        const root = document.documentElement;
        const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
        const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        if (reduced) {
            return;
        }

        let frame = 0;
        let x = -100;
        let y = -100;
        let targetX = -100;
        let targetY = -100;

        const tick = () => {
            // The cursor eases after the pointer.
            x += (targetX - x) * 0.22;
            y += (targetY - y) * 0.22;
            cursor.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0)`;
            frame = requestAnimationFrame(tick);
        };
        if (!fine) {
            return;
        }
        frame = requestAnimationFrame(tick);

        root.classList.add("has-cursor");
        const onMove = (event: PointerEvent) => {
            if (event.pointerType !== "mouse" && event.pointerType !== "pen") {
                return;
            }
            targetX = event.clientX;
            targetY = event.clientY;
            if (cursor.dataset.shown !== "true") {
                x = targetX;
                y = targetY;
                cursor.dataset.shown = "true";
            }
        };
        const onOver = (event: Event) => {
            const target = event.target instanceof Element ? event.target : null;
            const marked = target?.closest<HTMLElement>("[data-cursor]");
            const word = marked?.dataset.cursor ?? "";
            label.textContent = word;
            cursor.dataset.label = word ? "true" : "false";
            cursor.dataset.link =
                !word && target?.closest("a, button, [role='button'], label, select")
                    ? "true"
                    : "false";
        };
        const onLeave = () => {
            cursor.dataset.shown = "false";
        };
        const onDown = () => {
            cursor.dataset.pressed = "true";
        };
        const onUp = () => {
            cursor.dataset.pressed = "false";
        };
        window.addEventListener("pointermove", onMove, { passive: true });
        document.addEventListener("pointerover", onOver, { passive: true });
        document.documentElement.addEventListener("pointerleave", onLeave);
        window.addEventListener("pointerdown", onDown, { passive: true });
        window.addEventListener("pointerup", onUp, { passive: true });

        return () => {
            cancelAnimationFrame(frame);
            root.classList.remove("has-cursor");
            window.removeEventListener("pointermove", onMove);
            document.removeEventListener("pointerover", onOver);
            document.documentElement.removeEventListener("pointerleave", onLeave);
            window.removeEventListener("pointerdown", onDown);
            window.removeEventListener("pointerup", onUp);
        };
    }, []);

    return (
        <div ref={ref} className="custom-cursor" aria-hidden="true" data-shown="false">
            <span ref={labelRef} className="custom-cursor-label" />
        </div>
    );
}
