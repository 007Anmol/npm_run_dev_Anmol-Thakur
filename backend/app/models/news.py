from pydantic import BaseModel, Field, HttpUrl
from datetime import datetime
from typing import List, Optional

class NewsArticle(BaseModel):
    id: str
    title: str = Field(..., min_length=10, max_length=200)
    content: str
    date_published: datetime = Field(default_factory=datetime.utcnow)
    source: str
    url: Optional[HttpUrl] = None
    tags: List[str] = []

    def preview(self) -> str:
        """Returns a short preview of the news article."""
        return self.content[:150] + "..." if len(self.content) > 150 else self.content

    def add_tag(self, tag: str):
        """Adds a tag to the news article."""
        if tag not in self.tags:
            self.tags.append(tag)

    def remove_tag(self, tag: str):
        """Removes a tag from the news article."""
        if tag in self.tags:
            self.tags.remove(tag)

# Example usage:
if __name__ == "__main__":
    article = NewsArticle(
        id="news-789",
        title="Supreme Court Ruling on Privacy Law",
        content="The Supreme Court has made a landmark decision regarding digital privacy...",
        source="Legal Times",
        url="https://legaltimes.com/privacy-law"
    )
    print(article.preview())
    article.add_tag("Privacy Law")
    print(article.dict())
