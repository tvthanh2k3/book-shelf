import type { Review, ReviewCreate, ReviewUpdate } from '@/types'
import { createCRUDService } from './createCRUDService'

const service = createCRUDService<Review, ReviewCreate, ReviewUpdate>('/reviews')

export const getReviews = service.list
export const createReview = service.create
export const updateReview = service.update
export const deleteReview = service.remove
