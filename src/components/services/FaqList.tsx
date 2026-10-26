import { Accordion, AccordionItem } from "@sometic/react/structure";
import type { Faq } from "@/types/content";

type FaqListProps = {
    faqs: Faq[];
    idPrefix: string;
};

export function FaqList({ faqs, idPrefix }: FaqListProps) {
    if (faqs.length === 0) {
        return null;
    }
    return (
        <Accordion type="multiple" className="faq-list" data-testid="faq-list">
            {faqs.map((faq, index) => (
                <AccordionItem
                    key={faq.question}
                    value={`${idPrefix}-${index}`}
                    title={faq.question}
                    className="faq-item"
                >
                    <p className="text-body">{faq.answer}</p>
                </AccordionItem>
            ))}
        </Accordion>
    );
}
