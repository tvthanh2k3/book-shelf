from pydantic import BaseModel


class BookBase(BaseModel):
    title: str
    author_id: int


class BookCreate(BookBase):
    pass


class BookUpdate(BookBase):
    pass


class BookOut(BookBase):
    id: int
    author_name: str

    model_config = {"from_attributes": True}
