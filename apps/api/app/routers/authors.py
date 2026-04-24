from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app import crud
from app.core.deps import PaginationParams
from app.db.session import get_db
from app.schemas.author import AuthorCreate, AuthorOut, AuthorUpdate
from app.schemas.common import PaginatedResponse

router = APIRouter(prefix="/authors", tags=["Authors"])


@router.get("", response_model=PaginatedResponse[AuthorOut])
async def list_authors(pagination: PaginationParams = Depends(), db: AsyncSession = Depends(get_db)):
    total, items = await crud.author.get_all(db, skip=pagination.skip, limit=pagination.limit)
    return {"total": total, "skip": pagination.skip, "limit": pagination.limit, "items": items}


@router.post("", response_model=AuthorOut, status_code=status.HTTP_201_CREATED)
async def create_author(data: AuthorCreate, db: AsyncSession = Depends(get_db)):
    return await crud.author.create(db, data)


@router.put("/{author_id}", response_model=AuthorOut)
async def update_author(author_id: int, data: AuthorUpdate, db: AsyncSession = Depends(get_db)):
    result = await crud.author.update(db, author_id, data)
    if not result:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Author not found")
    return result


@router.delete("/{author_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_author(author_id: int, db: AsyncSession = Depends(get_db)):
    deleted = await crud.author.delete(db, author_id)
    if not deleted:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Author not found")
