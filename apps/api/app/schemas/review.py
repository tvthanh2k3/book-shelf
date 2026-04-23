from pydantic import BaseModel


class ReviewBase(BaseModel):
    book_id: int
    review: str


class ReviewCreate(ReviewBase):
    pass


class ReviewUpdate(ReviewBase):
    pass


class ReviewOut(ReviewBase):
    id: int
    book_title: str
    author_name: str

    model_config = {"from_attributes": True}
