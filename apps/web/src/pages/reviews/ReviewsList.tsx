import { useState } from 'react'
import { Pencil, Trash2 } from 'lucide-react'
import { useReviews, useDeleteReview } from '@/hooks/useReviews'
import DataTable, { type Column } from '@/components/common/DataTable'
import Pagination from '@/components/common/Pagination'
import ConfirmDeleteModal from '@/components/common/ConfirmDeleteModal'
import ReviewUpdateModal from '@/components/forms/ReviewUpdateModal'
import { Button } from '@/components/ui/button'
import type { Review } from '@/types'

const PAGE_SIZE = 10

export default function ReviewsList() {
  const [page, setPage] = useState(1)
  const [editTarget, setEditTarget] = useState<Review | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<Review | null>(null)

  const { data, isLoading } = useReviews(page, PAGE_SIZE)
  const deleteReview = useDeleteReview()

  const handleDelete = () => {
    if (!deleteTarget) return
    deleteReview.mutate(deleteTarget.id, {
      onSuccess: () => setDeleteTarget(null),
    })
  }

  const columns: Column<Review>[] = [
    {
      header: 'No',
      cell: (_, index) => (data?.skip ?? 0) + index + 1,
      className: 'w-16 text-muted-foreground',
    },
    {
      header: 'Book',
      cell: (row) => <span className="font-medium">{row.book_title}</span>,
    },
    {
      header: 'Author',
      cell: (row) => <span className="text-muted-foreground">{row.author_name}</span>,
    },
    {
      header: 'Review',
      cell: (row) => (
        <span className="text-sm line-clamp-2 max-w-xs">{row.review}</span>
      ),
    },
    {
      header: 'Actions',
      className: 'w-24 text-center',
      cell: (row) => (
        <div className="flex items-center justify-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground"
            onClick={() => setEditTarget(row)}
          >
            <Pencil size={15} />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive"
            onClick={() => setDeleteTarget(row)}
          >
            <Trash2 size={15} />
          </Button>
        </div>
      ),
    },
  ]

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-foreground">Reviews</h1>
        <p className="text-sm text-muted-foreground mt-1">Manage the list of book reviews</p>
      </div>

      <DataTable
        columns={columns}
        data={data?.items ?? []}
        skip={data?.skip ?? 0}
        isLoading={isLoading}
      />

      <Pagination
        total={data?.total ?? 0}
        page={page}
        pageSize={PAGE_SIZE}
        onChange={setPage}
      />

      <ReviewUpdateModal
        review={editTarget}
        onClose={() => setEditTarget(null)}
      />

      <ConfirmDeleteModal
        open={!!deleteTarget}
        itemName={deleteTarget?.book_title ?? ''}
        isPending={deleteReview.isPending}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
      />
    </div>
  )
}
