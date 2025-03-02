from pydantic import BaseModel, Field, EmailStr
from datetime import date, datetime
from typing import Optional

class KYCVerification(BaseModel):
    user_id: str
    full_name: str = Field(..., min_length=3, max_length=100)
    dob: date
    email: EmailStr
    document_type: str
    document_number: str = Field(..., min_length=6, max_length=20)
    issue_date: date
    expiry_date: Optional[date] = None
    status: str = "Pending"
    submitted_at: datetime = Field(default_factory=datetime.utcnow)
    verified_by: Optional[str] = None
    verified_at: Optional[datetime] = None
    rejection_reason: Optional[str] = None

    def approve(self, verifier: str):
        """Approves the KYC verification."""
        self.status = "Approved"
        self.verified_by = verifier
        self.verified_at = datetime.utcnow()

    def reject(self, reason: str, verifier: str):
        """Rejects the KYC verification with a reason."""
        self.status = "Rejected"
        self.rejection_reason = reason
        self.verified_by = verifier
        self.verified_at = datetime.utcnow()

    def is_expired(self) -> bool:
        """Checks if the document is expired."""
        if self.expiry_date:
            return self.expiry_date < datetime.utcnow().date()
        return False

# Example usage:
if __name__ == "__main__":
    kyc = KYCVerification(
        user_id="user-456",
        full_name="Alice Johnson",
        dob=date(1995, 6, 15),
        email="alice@example.com",
        document_type="Passport",
        document_number="A12345678",
        issue_date=date(2020, 5, 1),
        expiry_date=date(2030, 5, 1)
    )
    print(kyc.dict())
    kyc.approve("Admin123")
    print(kyc.dict())
