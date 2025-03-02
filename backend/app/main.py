from fastapi import FastAPI, HTTPException, Depends
from typing import List
from datetime import datetime
from schemas.news import NewsCreate, NewsResponse
from schemas.user import UserCreate, UserResponse
from schemas.schemas import ResponseSchema, SearchQuerySchema, SearchResultSchema
from core.db import get_db, Base, engine
from core.logging import setup_logging
from sqlalchemy.orm import Session

app = FastAPI(title="Advanced AI-Powered Legal Aid API")

# Set up logging
logger = setup_logging()

# Initialize database
Base.metadata.create_all(bind=engine)

# ========================== USER ROUTES ==========================

@app.post("/users/", response_model=UserResponse)
def create_user(user: UserCreate, db: Session = Depends(get_db)):
    """Creates a new user."""
    user_id = f"user-{datetime.utcnow().timestamp()}"
    new_user = UserResponse(id=user_id, **user.dict(), created_at=datetime.utcnow())
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    logger.info(f"User created: {user_id}")
    return new_user

@app.get("/users/", response_model=List[UserResponse])
def get_users(db: Session = Depends(get_db)):
    """Retrieves all users."""
    users = db.query(UserResponse).all()
    return users

# ========================== NEWS ROUTES ==========================

@app.post("/news/", response_model=NewsResponse)
def create_news(news: NewsCreate, db: Session = Depends(get_db)):
    """Creates a new legal news article."""
    news_id = f"news-{datetime.utcnow().timestamp()}"
    new_news = NewsResponse(id=news_id, **news.dict(), date_published=datetime.utcnow())
    db.add(new_news)
    db.commit()
    db.refresh(new_news)
    logger.info(f"News created: {news_id}")
    return new_news

@app.get("/news/", response_model=List[NewsResponse])
def get_news(db: Session = Depends(get_db)):
    """Retrieves all legal news articles."""
    return db.query(NewsResponse).all()

# ========================== SEARCH ROUTES ==========================

@app.post("/search/", response_model=SearchResultSchema)
def search_legal_data(query: SearchQuerySchema):
    """Simulates searching legal documents, news, or user queries."""
    fake_result_count = len(query.query) * 2
    logger.info(f"Search performed: {query.query}")
    return SearchResultSchema(query=query.query, results=fake_result_count)

# ========================== UTILITY ROUTES ==========================

@app.get("/status/", response_model=ResponseSchema)
def system_status():
    """Returns the API status."""
    return ResponseSchema(success=True, message="API is running smoothly")

# Run the FastAPI application
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)
