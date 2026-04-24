import type { Author, AuthorCreate, AuthorUpdate } from '@/types'
import { createCRUDService } from './createCRUDService'

const service = createCRUDService<Author, AuthorCreate, AuthorUpdate>('/authors')

export const getAuthors = service.list
export const createAuthor = service.create
export const updateAuthor = service.update
export const deleteAuthor = service.remove
