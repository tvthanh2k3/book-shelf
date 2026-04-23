import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

export interface Column<T> {
  header: string
  cell: (row: T, index: number) => React.ReactNode
  className?: string
}

interface DataTableProps<T> {
  columns: Column<T>[]
  data: T[]
  skip?: number
  isLoading?: boolean
  emptyMessage?: string
}

function SkeletonRows({ cols }: { cols: number }) {
  return Array.from({ length: 5 }).map((_, i) => (
    <TableRow key={i}>
      {Array.from({ length: cols }).map((_, j) => (
        <TableCell key={j}>
          <div className="h-4 bg-muted rounded animate-pulse w-3/4" />
        </TableCell>
      ))}
    </TableRow>
  ))
}

export default function DataTable<T>({
  columns,
  data,
  skip = 0,
  isLoading,
  emptyMessage = 'No data found.',
}: DataTableProps<T>) {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50">
            {columns.map((col, i) => (
              <TableHead key={i} className={col.className}>
                {col.header}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <SkeletonRows cols={columns.length} />
          ) : data.length === 0 ? (
            <TableRow>
              <TableCell colSpan={columns.length} className="text-center text-muted-foreground py-10">
                {emptyMessage}
              </TableCell>
            </TableRow>
          ) : (
            data.map((row, index) => (
              <TableRow key={index} className="hover:bg-muted/30">
                {columns.map((col, j) => (
                  <TableCell key={j} className={col.className}>
                    {col.cell(row, skip + index)}
                  </TableCell>
                ))}
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  )
}
