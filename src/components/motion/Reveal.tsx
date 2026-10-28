import { createElement, type CSSProperties, type ElementType, type ReactNode } from "react";
import { useParallax, useReveal } from "@/components/motion/motion.hooks";

type RevealProps = {
    children?: ReactNode;
    as?: ElementType;
    className?: string;
    /** Delay in milliseconds, used to stagger siblings. */
    delay?: number;
    /** "fade" lifts and fades; "rule" draws a hairline from the left; "clip" opens an image. */
    variant?: "fade" | "rule" | "clip";
    id?: string;
};

/** Reveals its children once when they scroll into view. Visible without JS. */
export function Reveal({
    children,
    as = "div",
    className,
    delay = 0,
    variant = "fade",
    id,
}: RevealProps) {
    const ref = useReveal<HTMLElement>({ watch: variant === "clip" ? "parent" : "self" });
    return createElement(
        as,
        {
            ref,
            id,
            className,
            "data-reveal": variant,
            style: delay ? ({ "--reveal-delay": `${delay}ms` } as CSSProperties) : undefined,
        },
        children,
    );
}

type TextRevealProps = {
    /** Words animate in sequence; ignored when `lines` is given. */
    text?: string;
    /** Art-directed lines. Each line rises through its own mask. */
    lines?: string[];
    /** "load" plays immediately via CSS (use above the fold); "scroll" waits for the viewport. */
    trigger?: "load" | "scroll";
    /** Delay in milliseconds before the first word or line. */
    delay?: number;
};

/**
 * Masked text reveal for headings. Render it inside the heading element so the heading keeps its
 * normal text content and accessible name.
 */
export function TextReveal({ text, lines, trigger = "scroll", delay = 0 }: TextRevealProps) {
    const ref = useReveal<HTMLSpanElement>({ inset: 0.12 });
    const parts = lines ?? (text ?? "").split(" ").filter(Boolean);
    const byLine = Boolean(lines);
    const unit = byLine ? 110 : 34;

    const content = parts.map((part, index) => (
        <span key={`${part}-${index}`} style={{ display: "contents" }}>
            <span
                className={byLine ? "split-line" : "split-word"}
                data-line={byLine ? index : undefined}
            >
                <span
                    className="split-inner"
                    style={{ "--split-delay": `${delay + index * unit}ms` } as CSSProperties}
                >
                    {part}
                </span>
            </span>
            {byLine ? " " : index < parts.length - 1 ? " " : null}
        </span>
    ));

    return trigger === "load" ? (
        <span className="split-root" data-split="load">
            {content}
        </span>
    ) : (
        <span ref={ref} className="split-root" data-split="scroll">
            {content}
        </span>
    );
}

type ParallaxImageProps = {
    src: string;
    alt: string;
    className?: string;
    imageClassName?: string;
    width?: number;
    height?: number;
    loading?: "eager" | "lazy";
    strength?: number;
};

/** An image that drifts slightly inside a fixed frame as the page scrolls. */
export function ParallaxImage({
    src,
    alt,
    className,
    imageClassName,
    width,
    height,
    loading = "lazy",
    strength = 7,
}: ParallaxImageProps) {
    const ref = useParallax<HTMLDivElement>(strength);
    return (
        <div ref={ref} className={["parallax-frame", className].filter(Boolean).join(" ")}>
            <img
                src={src}
                alt={alt}
                width={width}
                height={height}
                loading={loading}
                decoding="async"
                className={["parallax-image", imageClassName].filter(Boolean).join(" ")}
            />
        </div>
    );
}
