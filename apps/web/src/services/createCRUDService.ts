import type { PaginatedResponse } from '@/types'
import api from './api'

export function createCRUDService<T, TCreate, TUpdate>(endpoint: string) {
  return {
    list: async (skip: number, limit: number): Promise<PaginatedResponse<T>> => {
      const { data } = await api.get(endpoint, { params: { skip, limit } })
      return data
    },
    create: async (payload: TCreate): Promise<T> => {
      const { data } = await api.post(endpoint, payload)
      return data
    },
    update: async (id: number, payload: TUpdate): Promise<T> => {
      const { data } = await api.put(`${endpoint}/${id}`, payload)
      return data
    },
    remove: async (id: number): Promise<void> => {
      await api.delete(`${endpoint}/${id}`)
    },
  }
}
