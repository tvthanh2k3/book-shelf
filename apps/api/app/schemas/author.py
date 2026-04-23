from pydantic import BaseModel


class AuthorBase(BaseModel):
    name: str


class AuthorCreate(AuthorBase):
    pass


class AuthorUpdate(AuthorBase):
    pass


class AuthorOut(AuthorBase):
    id: int
    books_count: int = 0

    model_config = {"from_attributes": True}
