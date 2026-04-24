import { createCRUDHooks } from './createCRUDHooks'
import { getReviews, createReview, updateReview, deleteReview } from '@/services/reviews'
import type { Review, ReviewCreate, ReviewUpdate } from '@/types'

const { useList, useCreate, useUpdate, useRemove } = createCRUDHooks<Review, ReviewCreate, ReviewUpdate>(
  'reviews',
  { list: getReviews, create: createReview, update: updateReview, remove: deleteReview },
  'Review',
)

export const useReviews = useList
export const useCreateReview = useCreate
export const useUpdateReview = useUpdate
export const useDeleteReview = useRemove
