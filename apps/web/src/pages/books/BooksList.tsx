import { useState } from 'react'
import { useBooks, useDeleteBook } from '@/hooks/useBooks'
import { usePaginatedList } from '@/hooks/usePaginatedList'
import DataTable, { type Column } from '@/components/common/DataTable'
import Pagination from '@/components/common/Pagination'
import ConfirmDeleteModal from '@/components/common/ConfirmDeleteModal'
import BookUpdateModal from '@/components/forms/BookUpdateModal'
import { actionColumn } from '@/components/common/actionColumn'
import type { Book } from '@/types'

export default function BooksList() {
  const { page, PAGE_SIZE, rowNumber, goToPrevIfEmpty, paginationProps } = usePaginatedList()
  const [editTarget, setEditTarget] = useState<Book | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<Book | null>(null)

  const { data, isLoading } = useBooks(page, PAGE_SIZE)
  const deleteBook = useDeleteBook()

  const handleDelete = () => {
    if (!deleteTarget) return
    deleteBook.mutate(deleteTarget.id, {
      onSuccess: () => {
        setDeleteTarget(null)
        goToPrevIfEmpty(data?.items.length ?? 0)
      },
    })
  }

  const columns: Column<Book>[] = [
    {
      header: 'No',
      cell: (_, index) => rowNumber(index),
      className: 'w-16 text-muted-foreground',
    },
    {
      header: 'Title',
      cell: (row) => <span className="font-medium">{row.title}</span>,
    },
    {
      header: 'Author',
      cell: (row) => <span className="text-muted-foreground">{row.author_name}</span>,
    },
    actionColumn(setEditTarget, setDeleteTarget),
  ]

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-foreground">Books</h1>
        <p className="text-sm text-muted-foreground mt-1">Manage the list of books</p>
      </div>

      <DataTable
        columns={columns}
        data={data?.items ?? []}
        isLoading={isLoading}
      />

      <Pagination total={data?.total ?? 0} {...paginationProps} />

      <BookUpdateModal
        book={editTarget}
        onClose={() => setEditTarget(null)}
      />

      <ConfirmDeleteModal
        open={!!deleteTarget}
        itemName={deleteTarget?.title ?? ''}
        isPending={deleteBook.isPending}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
      />
    </div>
  )
}
