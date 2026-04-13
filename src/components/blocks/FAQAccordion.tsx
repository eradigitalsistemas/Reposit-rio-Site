import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'

export interface FAQItem {
  question: string
  answer: string
}

export interface FAQAccordionProps {
  items: FAQItem[]
  category?: string
}

export function FAQAccordion({ items, category }: FAQAccordionProps) {
  if (items.length === 0) return null

  return (
    <div className="space-y-4">
      {category && (
        <h2 className="text-2xl font-semibold text-primary/80 border-b pb-2">{category}</h2>
      )}
      <Accordion type="single" collapsible className="w-full">
        {items.map((item, idx) => (
          <AccordionItem key={idx} value={`item-${idx}`}>
            <AccordionTrigger className="text-left font-medium">{item.question}</AccordionTrigger>
            <AccordionContent className="text-muted-foreground leading-relaxed">
              {item.answer}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  )
}
