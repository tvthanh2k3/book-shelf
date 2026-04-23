import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { createReview, deleteReview, getReviews, updateReview } from '@/services/reviews'
import { getBooks } from '@/services/books'
import type { ReviewCreate, ReviewUpdate } from '@/types'

const QUERY_KEY = 'reviews'

export const useReviews = (page: number, pageSize: number) => {
  const skip = (page - 1) * pageSize
  return useQuery({
    queryKey: [QUERY_KEY, page, pageSize],
    queryFn: () => getReviews(skip, pageSize),
  })
}

export const useAllBooks = () =>
  useQuery({
    queryKey: ['books', 'all'],
    queryFn: () => getBooks(0, 1000),
    select: (data) => data.items,
  })

export const useCreateReview = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (payload: ReviewCreate) => createReview(payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [QUERY_KEY] }),
  })
}

export const useUpdateReview = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: ReviewUpdate }) =>
      updateReview(id, payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [QUERY_KEY] }),
  })
}

export const useDeleteReview = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => deleteReview(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [QUERY_KEY] }),
  })
}
