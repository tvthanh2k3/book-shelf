import type { Book, BookCreate, BookUpdate, PaginatedResponse } from '@/types'
import api from './api'

export const getBooks = async (skip: number, limit: number): Promise<PaginatedResponse<Book>> => {
  const { data } = await api.get('/books', { params: { skip, limit } })
  return data
}

export const createBook = async (payload: BookCreate): Promise<Book> => {
  const { data } = await api.post('/books', payload)
  return data
}

export const updateBook = async (id: number, payload: BookUpdate): Promise<Book> => {
  const { data } = await api.put(`/books/${id}`, payload)
  return data
}

export const deleteBook = async (id: number): Promise<void> => {
  await api.delete(`/books/${id}`)
}
