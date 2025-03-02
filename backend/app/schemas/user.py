from pydantic import BaseModel, EmailStr, Field
from datetime import datetime
from typing import List, Optional

class UserBase(BaseModel):
    name: str = Field(..., min_length=3, max_length=100)
    email: EmailStr
    role: str = "User"
    is_active: bool = True

class UserCreate(UserBase):
    password: str = Field(..., min_length=6, max_length=50)

class UserResponse(UserBase):
    id: str
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    permissions: List[str] = []

    class Config:
        from_attributes = True

# Example usage
if __name__ == "__main__":
    user = UserResponse(
        id="user-101",
        name="Alice Doe",
        email="alice@example.com",
        role="Admin",
        permissions=["read", "write"]
    )
    print(user.dict())
