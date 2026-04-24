import { useState } from 'react'
import { useAuthors, useDeleteAuthor } from '@/hooks/useAuthors'
import { usePaginatedList } from '@/hooks/usePaginatedList'
import DataTable, { type Column } from '@/components/common/DataTable'
import Pagination from '@/components/common/Pagination'
import ConfirmDeleteModal from '@/components/common/ConfirmDeleteModal'
import AuthorUpdateModal from '@/components/forms/AuthorUpdateModal'
import { actionColumn } from '@/components/common/actionColumn'
import type { Author } from '@/types'

export default function AuthorsList() {
  const { page, PAGE_SIZE, rowNumber, goToPrevIfEmpty, paginationProps } = usePaginatedList()
  const [editTarget, setEditTarget] = useState<Author | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<Author | null>(null)

  const { data, isLoading } = useAuthors(page, PAGE_SIZE)
  const deleteAuthor = useDeleteAuthor()

  const handleDelete = () => {
    if (!deleteTarget) return
    deleteAuthor.mutate(deleteTarget.id, {
      onSuccess: () => {
        setDeleteTarget(null)
        goToPrevIfEmpty(data?.items.length ?? 0)
      },
    })
  }

  const columns: Column<Author>[] = [
    {
      header: 'No',
      cell: (_, index) => rowNumber(index),
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
    actionColumn(setEditTarget, setDeleteTarget),
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

      <Pagination total={data?.total ?? 0} {...paginationProps} />

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
