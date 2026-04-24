import { Pencil, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { Column } from '@/components/common/DataTable'

export function actionColumn<T>(
  onEdit: (row: T) => void,
  onDelete: (row: T) => void,
): Column<T> {
  return {
    header: 'Actions',
    className: 'w-24 text-center',
    cell: (row) => (
      <div className="flex items-center justify-center gap-2">
        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground"
          onClick={() => onEdit(row)}
        >
          <Pencil size={15} />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive"
          onClick={() => onDelete(row)}
        >
          <Trash2 size={15} />
        </Button>
      </div>
    ),
  }
}
