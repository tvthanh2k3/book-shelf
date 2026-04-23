from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routers import authors, books, reviews

app = FastAPI(title="BookShelf API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(authors.router)
app.include_router(books.router)
app.include_router(reviews.router)
