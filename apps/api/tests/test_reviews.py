import pytest
from httpx import AsyncClient


@pytest.fixture
async def book_id(client: AsyncClient):
    author = await client.post("/authors", json={"name": "Test Author"})
    author_id = author.json()["id"]
    book = await client.post("/books", json={"title": "Test Book", "author_id": author_id})
    return book.json()["id"]


@pytest.mark.asyncio
async def test_list_reviews_empty(client: AsyncClient):
    response = await client.get("/reviews")
    assert response.status_code == 200
    data = response.json()
    assert data["total"] == 0
    assert data["items"] == []


@pytest.mark.asyncio
async def test_create_review(client: AsyncClient, book_id: int):
    response = await client.post("/reviews", json={"book_id": book_id, "review": "Great book!"})
    assert response.status_code == 201
    data = response.json()
    assert data["review"] == "Great book!"
    assert data["book_id"] == book_id
    assert data["book_title"] == "Test Book"
    assert data["author_name"] == "Test Author"


@pytest.mark.asyncio
async def test_create_review_invalid_book(client: AsyncClient):
    response = await client.post("/reviews", json={"book_id": 999, "review": "Review"})
    assert response.status_code == 404


@pytest.mark.asyncio
async def test_list_reviews(client: AsyncClient, book_id: int):
    await client.post("/reviews", json={"book_id": book_id, "review": "Review 1"})
    await client.post("/reviews", json={"book_id": book_id, "review": "Review 2"})

    response = await client.get("/reviews")
    assert response.status_code == 200
    data = response.json()
    assert data["total"] == 2


@pytest.mark.asyncio
async def test_update_review(client: AsyncClient, book_id: int):
    create = await client.post("/reviews", json={"book_id": book_id, "review": "Old review"})
    review_id = create.json()["id"]

    response = await client.put(f"/reviews/{review_id}", json={"book_id": book_id, "review": "Updated review"})
    assert response.status_code == 200
    assert response.json()["review"] == "Updated review"


@pytest.mark.asyncio
async def test_update_review_not_found(client: AsyncClient, book_id: int):
    response = await client.put("/reviews/999", json={"book_id": book_id, "review": "X"})
    assert response.status_code == 404


@pytest.mark.asyncio
async def test_delete_review(client: AsyncClient, book_id: int):
    create = await client.post("/reviews", json={"book_id": book_id, "review": "To Delete"})
    review_id = create.json()["id"]

    response = await client.delete(f"/reviews/{review_id}")
    assert response.status_code == 204

    list_response = await client.get("/reviews")
    assert list_response.json()["total"] == 0


@pytest.mark.asyncio
async def test_delete_review_not_found(client: AsyncClient):
    response = await client.delete("/reviews/999")
    assert response.status_code == 404
