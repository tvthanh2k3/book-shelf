import type { PaginatedResponse, Review, ReviewCreate, ReviewUpdate } from '@/types'
import api from './api'

export const getReviews = async (skip: number, limit: number): Promise<PaginatedResponse<Review>> => {
  const { data } = await api.get('/reviews', { params: { skip, limit } })
  return data
}

export const createReview = async (payload: ReviewCreate): Promise<Review> => {
  const { data } = await api.post('/reviews', payload)
  return data
}

export const updateReview = async (id: number, payload: ReviewUpdate): Promise<Review> => {
  const { data } = await api.put(`/reviews/${id}`, payload)
  return data
}

export const deleteReview = async (id: number): Promise<void> => {
  await api.delete(`/reviews/${id}`)
}
