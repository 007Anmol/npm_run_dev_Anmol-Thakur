from pydantic import BaseModel, EmailStr, Field
from datetime import datetime
from typing import List, Optional

class User(BaseModel):
    id: str
    name: str = Field(..., min_length=3, max_length=100)
    email: EmailStr
    role: str = "User"
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    permissions: List[str] = []
    is_active: bool = True
    last_login: Optional[datetime] = None

    def set_role(self, new_role: str):
        """Updates the user's role."""
        self.role = new_role

    def update_permissions(self, new_permissions: List[str]):
        """Sets new permissions for the user."""
        self.permissions = new_permissions

    def deactivate(self):
        """Deactivates the user account."""
        self.is_active = False

# Example usage:
if __name__ == "__main__":
    user = User(id="user-001", name="Bob Williams", email="bob@example.com")
    user.set_role("Admin")
    user.update_permissions(["read", "write", "delete"])
    print(user.dict())
