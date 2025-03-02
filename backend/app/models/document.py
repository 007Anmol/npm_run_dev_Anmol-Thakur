from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime
import hashlib

class Document(BaseModel):
    id: str
    title: str = Field(..., min_length=5, max_length=100)
    content: str
    category: Optional[str] = "General"
    author: str
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    version: int = 1
    tags: List[str] = []
    hash: Optional[str] = None

    def generate_hash(self) -> str:
        """Generate a unique hash of the document content."""
        self.hash = hashlib.sha256(self.content.encode()).hexdigest()
        return self.hash

    def summary(self) -> str:
        """Returns a short summary of the document."""
        return self.content[:200] + "..." if len(self.content) > 200 else self.content

    def update_content(self, new_content: str):
        """Updates the document content, increments version, and updates timestamp."""
        self.content = new_content
        self.updated_at = datetime.utcnow()
        self.version += 1
        self.generate_hash()

    def add_tag(self, tag: str):
        """Adds a tag to the document."""
        if tag not in self.tags:
            self.tags.append(tag)

    def remove_tag(self, tag: str):
        """Removes a tag from the document."""
        if tag in self.tags:
            self.tags.remove(tag)

# Example usage:
if __name__ == "__main__":
    doc = Document(
        id="doc-123",
        title="Legal Contract",
        content="This contract is signed between parties A and B...",
        author="John Doe"
    )
    doc.generate_hash()
    print(doc.summary())
    doc.update_content("Updated content of the contract...")
    doc.add_tag("Confidential")
    print(doc.dict())
