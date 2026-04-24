from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.author import Author
from app.models.book import Book
from app.schemas.author import AuthorCreate, AuthorUpdate


def _books_count_sub():
    return (
        select(func.count(Book.id))
        .where(Book.author_id == Author.id)
        .correlate(Author)
        .scalar_subquery()
    )


def _row_to_dict(author, books_count):
    return {"id": author.id, "name": author.name, "books_count": books_count}


async def get_all(db: AsyncSession, skip: int, limit: int):
    count_sub = _books_count_sub()
    stmt = select(Author, count_sub.label("books_count")).order_by(Author.id.desc()).offset(skip).limit(limit)
    result = await db.execute(stmt)
    rows = result.all()

    total_stmt = select(func.count(Author.id))
    total = (await db.execute(total_stmt)).scalar_one()

    return total, [_row_to_dict(author, bc) for author, bc in rows]


async def get_by_id(db: AsyncSession, author_id: int):
    result = await db.execute(select(Author).where(Author.id == author_id))
    return result.scalar_one_or_none()


async def _get_by_id_with_count(db: AsyncSession, author_id: int):
    stmt = select(Author, _books_count_sub().label("books_count")).where(Author.id == author_id)
    result = await db.execute(stmt)
    row = result.one_or_none()
    if not row:
        return None
    return _row_to_dict(*row)


async def create(db: AsyncSession, data: AuthorCreate):
    author = Author(name=data.name)
    db.add(author)
    await db.commit()
    await db.refresh(author)
    return {"id": author.id, "name": author.name, "books_count": 0}


async def update(db: AsyncSession, author_id: int, data: AuthorUpdate):
    author = await get_by_id(db, author_id)
    if not author:
        return None
    author.name = data.name
    await db.commit()
    return await _get_by_id_with_count(db, author_id)


async def delete(db: AsyncSession, author_id: int):
    author = await get_by_id(db, author_id)
    if not author:
        return False
    await db.delete(author)
    await db.commit()
    return True
