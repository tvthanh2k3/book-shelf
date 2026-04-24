import { useQuery } from '@tanstack/react-query'
import { createCRUDHooks } from './createCRUDHooks'
import { getBooks, createBook, updateBook, deleteBook } from '@/services/books'
import type { Book, BookCreate, BookUpdate } from '@/types'

const { useList, useCreate, useUpdate, useRemove } = createCRUDHooks<Book, BookCreate, BookUpdate>(
  'books',
  { list: getBooks, create: createBook, update: updateBook, remove: deleteBook },
  'Book',
)

export const useBooks = useList
export const useCreateBook = useCreate
export const useUpdateBook = useUpdate
export const useDeleteBook = useRemove

export const useAllBooks = () =>
  useQuery({
    queryKey: ['books', 'all'],
    queryFn: () => getBooks(0, 1000),
    select: (data) => data.items,
  })
