import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { createAuthor, deleteAuthor, getAuthors, updateAuthor } from '@/services/authors'
import type { AuthorCreate, AuthorUpdate } from '@/types'

const QUERY_KEY = 'authors'

export const useAuthors = (page: number, pageSize: number) => {
  const skip = (page - 1) * pageSize
  return useQuery({
    queryKey: [QUERY_KEY, page, pageSize],
    queryFn: () => getAuthors(skip, pageSize),
  })
}

export const useCreateAuthor = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: AuthorCreate) => createAuthor(payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [QUERY_KEY] }),
  })
}

export const useUpdateAuthor = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: AuthorUpdate }) =>
      updateAuthor(id, payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [QUERY_KEY] }),
  })
}

export const useDeleteAuthor = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => deleteAuthor(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [QUERY_KEY] }),
  })
}
