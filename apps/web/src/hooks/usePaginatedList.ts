import { useState } from 'react'

const PAGE_SIZE = 5

export function usePaginatedList() {
  const [page, setPage] = useState(1)

  const rowNumber = (index: number) => (page - 1) * PAGE_SIZE + index + 1

  const goToPrevIfEmpty = (itemCount: number) => {
    if (itemCount === 1 && page > 1) setPage(page - 1)
  }

  const paginationProps = {
    page,
    pageSize: PAGE_SIZE,
    onChange: setPage,
  }

  return { page, PAGE_SIZE, rowNumber, goToPrevIfEmpty, paginationProps }
}
