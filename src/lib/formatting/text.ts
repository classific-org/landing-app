import type { ArticleBlock } from "@/types/content";

const WORDS_PER_MINUTE = 220;

export function countWords(text: string): number {
    const trimmed = text.trim();
    if (trimmed.length === 0) {
        return 0;
    }
    return trimmed.split(/\s+/).length;
}

export function articleBlocksToText(blocks: ArticleBlock[]): string {
    return blocks
        .map((block) => {
            if (block.type === "list") {
                return block.items.join(" ");
            }
            return block.text;
        })
        .join(" ");
}

export function estimateReadingMinutes(blocks: ArticleBlock[]): number {
    const words = countWords(articleBlocksToText(blocks));
    return Math.max(1, Math.ceil(words / WORDS_PER_MINUTE));
}

export function formatReadingTime(blocks: ArticleBlock[]): string {
    const minutes = estimateReadingMinutes(blocks);
    return `${minutes} min read`;
}

export function formatDate(isoDate: string, locale = "en-GB"): string {
    const parsed = new Date(`${isoDate}T00:00:00Z`);
    if (Number.isNaN(parsed.getTime())) {
        return isoDate;
    }
    return new Intl.DateTimeFormat(locale, {
        year: "numeric",
        month: "long",
        day: "numeric",
        timeZone: "UTC",
    }).format(parsed);
}

export function padStep(step: number): string {
    return step.toString().padStart(2, "0");
}
