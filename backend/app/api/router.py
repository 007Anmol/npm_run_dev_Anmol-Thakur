<<<<<<< HEAD
from fastapi import APIRouter, Depends
from core.dependencies import get_current_user
from schemas.user import UserResponse

router = APIRouter()

@router.get("/health", tags=["System"])
def health_check():
    return {"status": "ok"}

@router.get("/user/me", response_model=UserResponse, tags=["User"])
def get_current_user_data(current_user: UserResponse = Depends(get_current_user)):
    return current_user

@router.get("/legal/resources", tags=["Legal"])
def get_legal_resources():
    return [
        {"id": 1, "title": "Legal Aid Act", "description": "Explains free legal aid"},
        {"id": 2, "title": "Human Rights", "description": "Know your fundamental rights"}
    ]

@router.get("/lawyers", tags=["Lawyer"])
def find_lawyers(city: str = "Mumbai"):
    return [
        {"id": 1, "name": "Advocate Sharma", "specialization": "Criminal Law", "city": city},
        {"id": 2, "name": "Advocate Mehta", "specialization": "Corporate Law", "city": city}
    ]
=======
from fastapi import APIRouter

router = APIRouter()

@router.get("/health")
def health_check():
    return {"status": "ok", "message": "API is running smoothly"}

@router.get("/info")
def get_info():
    return {"app_name": "Legal Aid API", "version": "1.0.0"}
>>>>>>> ac73e99c020b2d7bb0bc31f1d8f215e36d80d296
