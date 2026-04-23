import pytest
from httpx import AsyncClient


@pytest.fixture
async def author_id(client: AsyncClient):
    response = await client.post("/authors", json={"name": "Test Author"})
    return response.json()["id"]


@pytest.mark.asyncio
async def test_list_books_empty(client: AsyncClient):
    response = await client.get("/books")
    assert response.status_code == 200
    data = response.json()
    assert data["total"] == 0
    assert data["items"] == []


@pytest.mark.asyncio
async def test_create_book(client: AsyncClient, author_id: int):
    response = await client.post("/books", json={"title": "Truyen Kieu", "author_id": author_id})
    assert response.status_code == 201
    data = response.json()
    assert data["title"] == "Truyen Kieu"
    assert data["author_id"] == author_id
    assert data["author_name"] == "Test Author"


@pytest.mark.asyncio
async def test_create_book_invalid_author(client: AsyncClient):
    response = await client.post("/books", json={"title": "Book", "author_id": 999})
    assert response.status_code == 404


@pytest.mark.asyncio
async def test_list_books(client: AsyncClient, author_id: int):
    await client.post("/books", json={"title": "Book 1", "author_id": author_id})
    await client.post("/books", json={"title": "Book 2", "author_id": author_id})

    response = await client.get("/books")
    assert response.status_code == 200
    data = response.json()
    assert data["total"] == 2


@pytest.mark.asyncio
async def test_update_book(client: AsyncClient, author_id: int):
    create = await client.post("/books", json={"title": "Old Title", "author_id": author_id})
    book_id = create.json()["id"]

    response = await client.put(f"/books/{book_id}", json={"title": "New Title", "author_id": author_id})
    assert response.status_code == 200
    assert response.json()["title"] == "New Title"


@pytest.mark.asyncio
async def test_update_book_not_found(client: AsyncClient, author_id: int):
    response = await client.put("/books/999", json={"title": "X", "author_id": author_id})
    assert response.status_code == 404


@pytest.mark.asyncio
async def test_delete_book(client: AsyncClient, author_id: int):
    create = await client.post("/books", json={"title": "To Delete", "author_id": author_id})
    book_id = create.json()["id"]

    response = await client.delete(f"/books/{book_id}")
    assert response.status_code == 204

    list_response = await client.get("/books")
    assert list_response.json()["total"] == 0


@pytest.mark.asyncio
async def test_delete_book_not_found(client: AsyncClient):
    response = await client.delete("/books/999")
    assert response.status_code == 404
