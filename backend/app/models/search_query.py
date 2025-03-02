from pydantic import BaseModel, Field
from datetime import datetime

class SearchQuery(BaseModel):
    id: str
    user_id: str
    query: str = Field(..., min_length=3, max_length=500)
    timestamp: datetime = Field(default_factory=datetime.utcnow)
    results_found: int = 0

    def log_query(self):
        """Prints the search query details."""
        print(f"User {self.user_id} searched for '{self.query}' on {self.timestamp}")

# Example usage:
if __name__ == "__main__":
    search = SearchQuery(id="search-101", user_id="user-456", query="How to file an affidavit?")
    search.log_query()
