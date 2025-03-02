from pydantic import BaseModel, Field, HttpUrl
from datetime import datetime
from typing import List, Optional

class NewsBase(BaseModel):
    title: str = Field(..., min_length=10, max_length=200)
    content: str
    source: str
    url: Optional[HttpUrl] = None
    tags: List[str] = []

class NewsCreate(NewsBase):
    """Schema for creating a new news article."""
    pass

class NewsResponse(NewsBase):
    id: str
    date_published: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        from_attributes = True

# Example usage
if __name__ == "__main__":
    news = NewsResponse(
        id="news-001",
        title="Court Ruling on AI Laws",
        content="The latest court ruling sets precedence on AI regulation...",
        source="Legal Daily",
        url="https://legaldaily.com/ai-laws"
    )
    print(news.dict())
