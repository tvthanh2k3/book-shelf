import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface PaginationProps {
  total: number
  page: number
  pageSize: number
  onChange: (page: number) => void
}

export default function Pagination({ total, page, pageSize, onChange }: PaginationProps) {
  const totalPages = Math.ceil(total / pageSize)
  if (totalPages <= 1) return null

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1)

  return (
    <div className="flex items-center justify-end gap-1 mt-4">
      <Button
        variant="outline"
        size="sm"
        onClick={() => onChange(page - 1)}
        disabled={page === 1}
        className="h-8 w-8 p-0"
      >
        <ChevronLeft size={14} />
      </Button>

      {pages.map((p) => (
        <Button
          key={p}
          variant={p === page ? 'default' : 'outline'}
          size="sm"
          onClick={() => onChange(p)}
          className={cn('h-8 w-8 p-0', p === page && 'pointer-events-none')}
        >
          {p}
        </Button>
      ))}

      <Button
        variant="outline"
        size="sm"
        onClick={() => onChange(page + 1)}
        disabled={page === totalPages}
        className="h-8 w-8 p-0"
      >
        <ChevronRight size={14} />
      </Button>
    </div>
  )
}
