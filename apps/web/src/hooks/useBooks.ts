import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { createBook, deleteBook, getBooks, updateBook } from '@/services/books'
import { getAuthors } from '@/services/authors'
import type { BookCreate, BookUpdate } from '@/types'

const QUERY_KEY = 'books'

export const useBooks = (page: number, pageSize: number) => {
  const skip = (page - 1) * pageSize
  return useQuery({
    queryKey: [QUERY_KEY, page, pageSize],
    queryFn: () => getBooks(skip, pageSize),
  })
}

export const useAllAuthors = () =>
  useQuery({
    queryKey: ['authors', 'all'],
    queryFn: () => getAuthors(0, 1000),
    select: (data) => data.items,
  })

export const useCreateBook = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: BookCreate) => createBook(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] })
      toast.success('Book created successfully')
    },
    onError: (err: Error) => toast.error(err.message),
  })
}

export const useUpdateBook = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: BookUpdate }) =>
      updateBook(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] })
      toast.success('Book updated successfully')
    },
    onError: (err: Error) => toast.error(err.message),
  })
}

export const useDeleteBook = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => deleteBook(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] })
      toast.success('Book deleted successfully')
    },
    onError: (err: Error) => toast.error(err.message),
  })
}
