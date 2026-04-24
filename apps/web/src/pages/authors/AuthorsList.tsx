import { useState } from 'react'
import { Pencil, Trash2 } from 'lucide-react'
import { useAuthors, useDeleteAuthor } from '@/hooks/useAuthors'
import DataTable, { type Column } from '@/components/common/DataTable'
import Pagination from '@/components/common/Pagination'
import ConfirmDeleteModal from '@/components/common/ConfirmDeleteModal'
import AuthorUpdateModal from '@/components/forms/AuthorUpdateModal'
import { Button } from '@/components/ui/button'
import type { Author } from '@/types'

const PAGE_SIZE = 5

export default function AuthorsList() {
  const [page, setPage] = useState(1)
  const [editTarget, setEditTarget] = useState<Author | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<Author | null>(null)

  const { data, isLoading } = useAuthors(page, PAGE_SIZE)
  const deleteAuthor = useDeleteAuthor()

  const handleDelete = () => {
    if (!deleteTarget) return
    deleteAuthor.mutate(deleteTarget.id, {
      onSuccess: () => {
        setDeleteTarget(null)
        if (data?.items.length === 1 && page > 1) setPage(page - 1)
      },
    })
  }

  const columns: Column<Author>[] = [
    {
      header: 'No',
      cell: (_, index) => (page - 1) * PAGE_SIZE + index + 1,
      className: 'w-16 text-muted-foreground',
    },
    {
      header: 'Name',
      cell: (row) => <span className="font-medium">{row.name}</span>,
    },
    {
      header: 'Books',
      cell: (row) => row.books_count,
      className: 'w-24 text-center',
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
        <h1 className="text-2xl font-semibold text-foreground">Authors</h1>
        <p className="text-sm text-muted-foreground mt-1">Manage the list of authors</p>
      </div>

      <DataTable
        columns={columns}
        data={data?.items ?? []}
        isLoading={isLoading}
      />

      <Pagination
        total={data?.total ?? 0}
        page={page}
        pageSize={PAGE_SIZE}
        onChange={setPage}
      />

      <AuthorUpdateModal
        author={editTarget}
        onClose={() => setEditTarget(null)}
      />

      <ConfirmDeleteModal
        open={!!deleteTarget}
        itemName={deleteTarget?.name ?? ''}
        isPending={deleteAuthor.isPending}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
      />
    </div>
  )
}
