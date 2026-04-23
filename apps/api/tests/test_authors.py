import pytest
from httpx import AsyncClient


@pytest.mark.asyncio
async def test_list_authors_empty(client: AsyncClient):
    response = await client.get("/authors")
    assert response.status_code == 200
    data = response.json()
    assert data["total"] == 0
    assert data["items"] == []


@pytest.mark.asyncio
async def test_create_author(client: AsyncClient):
    response = await client.post("/authors", json={"name": "Nguyen Du"})
    assert response.status_code == 201
    data = response.json()
    assert data["name"] == "Nguyen Du"
    assert data["books_count"] == 0
    assert "id" in data


@pytest.mark.asyncio
async def test_list_authors(client: AsyncClient):
    await client.post("/authors", json={"name": "Nguyen Du"})
    await client.post("/authors", json={"name": "Nam Quoc"})

    response = await client.get("/authors")
    assert response.status_code == 200
    data = response.json()
    assert data["total"] == 2
    assert len(data["items"]) == 2


@pytest.mark.asyncio
async def test_update_author(client: AsyncClient):
    create = await client.post("/authors", json={"name": "Old Name"})
    author_id = create.json()["id"]

    response = await client.put(f"/authors/{author_id}", json={"name": "New Name"})
    assert response.status_code == 200
    assert response.json()["name"] == "New Name"


@pytest.mark.asyncio
async def test_update_author_not_found(client: AsyncClient):
    response = await client.put("/authors/999", json={"name": "X"})
    assert response.status_code == 404


@pytest.mark.asyncio
async def test_delete_author(client: AsyncClient):
    create = await client.post("/authors", json={"name": "To Delete"})
    author_id = create.json()["id"]

    response = await client.delete(f"/authors/{author_id}")
    assert response.status_code == 204

    list_response = await client.get("/authors")
    assert list_response.json()["total"] == 0


@pytest.mark.asyncio
async def test_delete_author_not_found(client: AsyncClient):
    response = await client.delete("/authors/999")
    assert response.status_code == 404
