from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.author import Author
from app.models.book import Book
from app.models.review import Review
from app.schemas.review import ReviewCreate, ReviewUpdate


async def get_all(db: AsyncSession, skip: int, limit: int):
    stmt = (
        select(
            Review,
            Book.title.label("book_title"),
            Author.name.label("author_name"),
        )
        .join(Book, Review.book_id == Book.id)
        .join(Author, Book.author_id == Author.id)
        .order_by(Review.id.desc())
        .offset(skip)
        .limit(limit)
    )
    result = await db.execute(stmt)
    rows = result.all()

    total_stmt = select(func.count(Review.id))
    total = (await db.execute(total_stmt)).scalar_one()

    items = []
    for review, book_title, author_name in rows:
        items.append({
            "id": review.id,
            "book_id": review.book_id,
            "review": review.review,
            "book_title": book_title,
            "author_name": author_name,
        })
    return total, items


async def get_by_id(db: AsyncSession, review_id: int):
    result = await db.execute(select(Review).where(Review.id == review_id))
    return result.scalar_one_or_none()


async def get_by_id_with_details(db: AsyncSession, review_id: int):
    stmt = (
        select(
            Review,
            Book.title.label("book_title"),
            Author.name.label("author_name"),
        )
        .join(Book, Review.book_id == Book.id)
        .join(Author, Book.author_id == Author.id)
        .where(Review.id == review_id)
    )
    result = await db.execute(stmt)
    row = result.one_or_none()
    if not row:
        return None
    review, book_title, author_name = row
    return {
        "id": review.id,
        "book_id": review.book_id,
        "review": review.review,
        "book_title": book_title,
        "author_name": author_name,
    }


async def create(db: AsyncSession, data: ReviewCreate):
    review = Review(book_id=data.book_id, review=data.review)
    db.add(review)
    await db.commit()
    await db.refresh(review)
    return review


async def update(db: AsyncSession, review_id: int, data: ReviewUpdate):
    review = await get_by_id(db, review_id)
    if not review:
        return None
    review.book_id = data.book_id
    review.review = data.review
    await db.commit()
    await db.refresh(review)
    return review


async def delete(db: AsyncSession, review_id: int):
    review = await get_by_id(db, review_id)
    if not review:
        return False
    await db.delete(review)
    await db.commit()
    return True
