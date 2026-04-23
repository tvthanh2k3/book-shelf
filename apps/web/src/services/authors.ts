import type { Author, AuthorCreate, AuthorUpdate, PaginatedResponse } from '@/types'
import api from './api'

export const getAuthors = async (skip: number, limit: number): Promise<PaginatedResponse<Author>> => {
  const { data } = await api.get('/authors', { params: { skip, limit } })
  return data
}

export const createAuthor = async (payload: AuthorCreate): Promise<Author> => {
  const { data } = await api.post('/authors', payload)
  return data
}

export const updateAuthor = async (id: number, payload: AuthorUpdate): Promise<Author> => {
  const { data } = await api.put(`/authors/${id}`, payload)
  return data
}

export const deleteAuthor = async (id: number): Promise<void> => {
  await api.delete(`/authors/${id}`)
}
