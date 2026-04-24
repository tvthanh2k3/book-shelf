import type { Book, BookCreate, BookUpdate } from '@/types'
import { createCRUDService } from './createCRUDService'

const service = createCRUDService<Book, BookCreate, BookUpdate>('/books')

export const getBooks = service.list
export const createBook = service.create
export const updateBook = service.update
export const deleteBook = service.remove
