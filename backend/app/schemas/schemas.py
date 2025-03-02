from pydantic import BaseModel, Field
from datetime import datetime
from typing import Optional

class ResponseSchema(BaseModel):
    success: bool
    message: str
    timestamp: datetime = Field(default_factory=datetime.utcnow)

class SearchQuerySchema(BaseModel):
    query: str = Field(..., min_length=3, max_length=500)

class SearchResultSchema(BaseModel):
    query: str
    results: int
    timestamp: datetime = Field(default_factory=datetime.utcnow)

# Example usage
if __name__ == "__main__":
    response = ResponseSchema(success=True, message="Operation completed successfully")
    print(response.dict())
