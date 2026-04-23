from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.author import Author
from app.models.book import Book
from app.schemas.book import BookCreate, BookUpdate


async def get_all(db: AsyncSession, skip: int, limit: int):
    stmt = (
        select(Book, Author.name.label("author_name"))
        .join(Author, Book.author_id == Author.id)
        .offset(skip)
        .limit(limit)
    )
    result = await db.execute(stmt)
    rows = result.all()

    total_stmt = select(func.count(Book.id))
    total = (await db.execute(total_stmt)).scalar_one()

    items = []
    for book, author_name in rows:
        items.append({
            "id": book.id,
            "title": book.title,
            "author_id": book.author_id,
            "author_name": author_name,
        })
    return total, items


async def get_by_id(db: AsyncSession, book_id: int):
    result = await db.execute(select(Book).where(Book.id == book_id))
    return result.scalar_one_or_none()


async def create(db: AsyncSession, data: BookCreate):
    book = Book(title=data.title, author_id=data.author_id)
    db.add(book)
    await db.commit()
    await db.refresh(book)
    return book


async def update(db: AsyncSession, book_id: int, data: BookUpdate):
    book = await get_by_id(db, book_id)
    if not book:
        return None
    book.title = data.title
    book.author_id = data.author_id
    await db.commit()
    await db.refresh(book)
    return book


async def delete(db: AsyncSession, book_id: int):
    book = await get_by_id(db, book_id)
    if not book:
        return False
    await db.delete(book)
    await db.commit()
    return True
