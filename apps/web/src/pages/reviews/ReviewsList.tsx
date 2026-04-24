import { useState } from 'react'
import { useReviews, useDeleteReview } from '@/hooks/useReviews'
import { usePaginatedList } from '@/hooks/usePaginatedList'
import DataTable, { type Column } from '@/components/common/DataTable'
import Pagination from '@/components/common/Pagination'
import ConfirmDeleteModal from '@/components/common/ConfirmDeleteModal'
import ReviewUpdateModal from '@/components/forms/ReviewUpdateModal'
import { actionColumn } from '@/components/common/actionColumn'
import type { Review } from '@/types'

export default function ReviewsList() {
  const { page, PAGE_SIZE, rowNumber, goToPrevIfEmpty, paginationProps } = usePaginatedList()
  const [editTarget, setEditTarget] = useState<Review | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<Review | null>(null)

  const { data, isLoading } = useReviews(page, PAGE_SIZE)
  const deleteReview = useDeleteReview()

  const handleDelete = () => {
    if (!deleteTarget) return
    deleteReview.mutate(deleteTarget.id, {
      onSuccess: () => {
        setDeleteTarget(null)
        goToPrevIfEmpty(data?.items.length ?? 0)
      },
    })
  }

  const columns: Column<Review>[] = [
    {
      header: 'No',
      cell: (_, index) => rowNumber(index),
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
    actionColumn(setEditTarget, setDeleteTarget),
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
        isLoading={isLoading}
      />

      <Pagination total={data?.total ?? 0} {...paginationProps} />

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
