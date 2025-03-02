from fastapi import APIRouter

router = APIRouter()

@router.get("/health")
def health_check():
    return {"status": "ok", "message": "API is running smoothly"}

@router.get("/info")
def get_info():
    return {"app_name": "Legal Aid API", "version": "1.0.0"}
