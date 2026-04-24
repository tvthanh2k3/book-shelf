import { useQuery } from '@tanstack/react-query'
import { createCRUDHooks } from './createCRUDHooks'
import { getAuthors, createAuthor, updateAuthor, deleteAuthor } from '@/services/authors'
import type { Author, AuthorCreate, AuthorUpdate } from '@/types'

const { useList, useCreate, useUpdate, useRemove } = createCRUDHooks<Author, AuthorCreate, AuthorUpdate>(
  'authors',
  { list: getAuthors, create: createAuthor, update: updateAuthor, remove: deleteAuthor },
  'Author',
)

export const useAuthors = useList
export const useCreateAuthor = useCreate
export const useUpdateAuthor = useUpdate
export const useDeleteAuthor = useRemove

export const useAllAuthors = () =>
  useQuery({
    queryKey: ['authors', 'all'],
    queryFn: () => getAuthors(0, 1000),
    select: (data) => data.items,
  })
