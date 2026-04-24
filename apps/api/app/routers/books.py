from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app import crud
from app.core.deps import PaginationParams
from app.db.session import get_db
from app.schemas.book import BookCreate, BookOut, BookUpdate
from app.schemas.common import PaginatedResponse

router = APIRouter(prefix="/books", tags=["Books"])


@router.get("", response_model=PaginatedResponse[BookOut])
async def list_books(pagination: PaginationParams = Depends(), db: AsyncSession = Depends(get_db)):
    total, items = await crud.book.get_all(db, skip=pagination.skip, limit=pagination.limit)
    return {"total": total, "skip": pagination.skip, "limit": pagination.limit, "items": items}


@router.post("", response_model=BookOut, status_code=status.HTTP_201_CREATED)
async def create_book(data: BookCreate, db: AsyncSession = Depends(get_db)):
    author = await crud.author.get_by_id(db, data.author_id)
    if not author:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Author not found")
    book = await crud.book.create(db, data)
    return {"id": book.id, "title": book.title, "author_id": book.author_id, "author_name": author.name}


@router.put("/{book_id}", response_model=BookOut)
async def update_book(book_id: int, data: BookUpdate, db: AsyncSession = Depends(get_db)):
    author = await crud.author.get_by_id(db, data.author_id)
    if not author:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Author not found")
    book = await crud.book.update(db, book_id, data)
    if not book:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Book not found")
    return {"id": book.id, "title": book.title, "author_id": book.author_id, "author_name": author.name}


@router.delete("/{book_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_book(book_id: int, db: AsyncSession = Depends(get_db)):
    deleted = await crud.book.delete(db, book_id)
    if not deleted:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Book not found")
