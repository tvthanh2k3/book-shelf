from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.author import Author
from app.models.book import Book
from app.schemas.author import AuthorCreate, AuthorUpdate


async def get_all(db: AsyncSession, skip: int, limit: int):
    count_sub = (
        select(func.count(Book.id))
        .where(Book.author_id == Author.id)
        .correlate(Author)
        .scalar_subquery()
    )
    stmt = select(Author, count_sub.label("books_count")).order_by(Author.id.desc()).offset(skip).limit(limit)
    result = await db.execute(stmt)
    rows = result.all()

    total_stmt = select(func.count(Author.id))
    total = (await db.execute(total_stmt)).scalar_one()

    items = []
    for author, books_count in rows:
        items.append({"id": author.id, "name": author.name, "books_count": books_count})
    return total, items


async def get_by_id(db: AsyncSession, author_id: int):
    result = await db.execute(select(Author).where(Author.id == author_id))
    return result.scalar_one_or_none()


async def get_by_id_with_count(db: AsyncSession, author_id: int):
    count_sub = (
        select(func.count(Book.id))
        .where(Book.author_id == Author.id)
        .correlate(Author)
        .scalar_subquery()
    )
    stmt = select(Author, count_sub.label("books_count")).where(Author.id == author_id)
    result = await db.execute(stmt)
    row = result.one_or_none()
    if not row:
        return None
    author, books_count = row
    return {"id": author.id, "name": author.name, "books_count": books_count}


async def create(db: AsyncSession, data: AuthorCreate):
    author = Author(name=data.name)
    db.add(author)
    await db.commit()
    await db.refresh(author)
    return author


async def update(db: AsyncSession, author_id: int, data: AuthorUpdate):
    author = await get_by_id(db, author_id)
    if not author:
        return None
    author.name = data.name
    await db.commit()
    await db.refresh(author)
    return author


async def delete(db: AsyncSession, author_id: int):
    author = await get_by_id(db, author_id)
    if not author:
        return False
    await db.delete(author)
    await db.commit()
    return True
