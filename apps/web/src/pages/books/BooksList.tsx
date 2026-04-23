import { useState } from 'react'
import { Pencil, Trash2 } from 'lucide-react'
import { useBooks, useDeleteBook } from '@/hooks/useBooks'
import DataTable, { type Column } from '@/components/common/DataTable'
import Pagination from '@/components/common/Pagination'
import ConfirmDeleteModal from '@/components/common/ConfirmDeleteModal'
import BookUpdateModal from '@/components/forms/BookUpdateModal'
import { Button } from '@/components/ui/button'
import type { Book } from '@/types'

const PAGE_SIZE = 10

export default function BooksList() {
  const [page, setPage] = useState(1)
  const [editTarget, setEditTarget] = useState<Book | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<Book | null>(null)

  const { data, isLoading } = useBooks(page, PAGE_SIZE)
  const deleteBook = useDeleteBook()

  const handleDelete = () => {
    if (!deleteTarget) return
    deleteBook.mutate(deleteTarget.id, {
      onSuccess: () => setDeleteTarget(null),
    })
  }

  const columns: Column<Book>[] = [
    {
      header: 'No',
      cell: (_, index) => (data?.skip ?? 0) + index + 1,
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
        <h1 className="text-2xl font-semibold text-foreground">Books</h1>
        <p className="text-sm text-muted-foreground mt-1">Manage the list of books</p>
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
