import { Navigate, Route, Routes } from 'react-router-dom'
import Layout from '@/components/layout/Layout'
import AuthorsList from '@/pages/authors/AuthorsList'
import AuthorsCreate from '@/pages/authors/AuthorsCreate'
import BooksList from '@/pages/books/BooksList'
import BooksCreate from '@/pages/books/BooksCreate'
import ReviewsList from '@/pages/reviews/ReviewsList'
import ReviewsCreate from '@/pages/reviews/ReviewsCreate'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/authors/list" replace />} />
      <Route element={<Layout />}>
        <Route path="/authors/list" element={<AuthorsList />} />
        <Route path="/authors/create" element={<AuthorsCreate />} />
        <Route path="/books/list" element={<BooksList />} />
        <Route path="/books/create" element={<BooksCreate />} />
        <Route path="/reviews/list" element={<ReviewsList />} />
        <Route path="/reviews/create" element={<ReviewsCreate />} />
      </Route>
    </Routes>
  )
}
