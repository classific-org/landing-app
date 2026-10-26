import { useDocumentHead } from "@/components/seo/DocumentHead.hooks";

/** Renders nothing; keeps the document head in sync with the current route. */
export function DocumentHead() {
    useDocumentHead();
    return null;
}
