export interface PaginatedResponse<T> {
  total: number
  skip: number
  limit: number
  items: T[]
}

export interface Author {
  id: number
  name: string
  books_count: number
}

export interface AuthorCreate {
  name: string
}

export interface AuthorUpdate {
  name: string
}

export interface Book {
  id: number
  title: string
  author_id: number
  author_name: string
}

export interface BookCreate {
  title: string
  author_id: number
}

export interface BookUpdate {
  title: string
  author_id: number
}

export interface Review {
  id: number
  book_id: number
  review: string
  book_title: string
  author_name: string
}

export interface ReviewCreate {
  book_id: number
  review: string
}

export interface ReviewUpdate {
  book_id: number
  review: string
}
