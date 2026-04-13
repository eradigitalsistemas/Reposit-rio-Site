import { ReactNode } from 'react'
import { Plus, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface DynamicFieldArrayProps<T> {
  title: string
  fields: T[]
  onAdd: () => void
  onRemove: (index: number) => void
  maxItems?: number
  renderItem: (field: T, index: number) => ReactNode
  emptyMessage?: string
}

export function DynamicFieldArray<T extends { id?: string }>({
  title,
  fields,
  onAdd,
  onRemove,
  maxItems = 10,
  renderItem,
  emptyMessage = 'Nenhum item adicionado.',
}: DynamicFieldArrayProps<T>) {
  return (
    <div className="space-y-4 w-full">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h4 className="text-lg font-semibold text-foreground">{title}</h4>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={onAdd}
          disabled={fields.length >= maxItems}
          className="w-full sm:w-auto"
        >
          <Plus className="w-4 h-4 mr-2" /> Adicionar Novo
        </Button>
      </div>

      {fields.length === 0 ? (
        <div className="p-8 bg-muted/30 border border-dashed rounded-lg text-center text-sm text-muted-foreground flex flex-col items-center justify-center gap-2">
          <p>{emptyMessage}</p>
          <Button type="button" variant="link" size="sm" onClick={onAdd}>
            Adicionar agora
          </Button>
        </div>
      ) : (
        <div className="space-y-6">
          {fields.map((field, index) => (
            <Card
              key={field.id || index}
              className="relative shadow-sm transition-all hover:shadow-md border-border/60"
            >
              <CardHeader className="py-3 px-4 md:px-6 border-b bg-muted/10 flex flex-row items-center justify-between space-y-0">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Item {index + 1}
                </CardTitle>
                {fields.length > 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-8 text-destructive hover:text-destructive hover:bg-destructive/10 -mr-2"
                    onClick={() => onRemove(index)}
                  >
                    <Trash2 className="h-4 w-4 mr-1.5" /> Remover
                  </Button>
                )}
              </CardHeader>
              <CardContent className="p-4 md:p-6">{renderItem(field, index)}</CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
