from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app import crud
from app.db.session import get_db
from app.schemas.common import PaginatedResponse
from app.schemas.review import ReviewCreate, ReviewOut, ReviewUpdate

router = APIRouter(prefix="/reviews", tags=["Reviews"])


@router.get("", response_model=PaginatedResponse[ReviewOut])
async def list_reviews(skip: int = 0, limit: int = 10, db: AsyncSession = Depends(get_db)):
    total, items = await crud.review.get_all(db, skip=skip, limit=limit)
    return {"total": total, "skip": skip, "limit": limit, "items": items}


@router.post("", response_model=ReviewOut, status_code=status.HTTP_201_CREATED)
async def create_review(data: ReviewCreate, db: AsyncSession = Depends(get_db)):
    book = await crud.book.get_by_id(db, data.book_id)
    if not book:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Book not found")
    review = await crud.review.create(db, data)
    return await crud.review.get_by_id_with_details(db, review.id)


@router.put("/{review_id}", response_model=ReviewOut)
async def update_review(review_id: int, data: ReviewUpdate, db: AsyncSession = Depends(get_db)):
    book = await crud.book.get_by_id(db, data.book_id)
    if not book:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Book not found")
    review = await crud.review.update(db, review_id, data)
    if not review:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Review not found")
    return await crud.review.get_by_id_with_details(db, review_id)


@router.delete("/{review_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_review(review_id: int, db: AsyncSession = Depends(get_db)):
    deleted = await crud.review.delete(db, review_id)
    if not deleted:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Review not found")
