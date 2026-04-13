import { Search } from 'lucide-react'
import { Input } from '@/components/ui/input'

export interface FAQSearchProps {
  onSearch: (term: string) => void
  placeholder?: string
}

export function FAQSearch({ onSearch, placeholder = 'Buscar perguntas...' }: FAQSearchProps) {
  return (
    <div className="relative max-w-xl mx-auto w-full">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
      <Input
        placeholder={placeholder}
        className="pl-10 h-12 text-base w-full"
        onChange={(e) => onSearch(e.target.value)}
      />
    </div>
  )
}
