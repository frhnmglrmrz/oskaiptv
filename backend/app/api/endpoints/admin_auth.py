from fastapi import APIRouter, Depends, HTTPException, status, Request
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from datetime import datetime

from app.db.database import get_db
from app.models.domain import Admin
from app.schemas.auth import Token, AdminCreate, AdminResponse
from app.core.security import verify_password, get_password_hash, create_access_token, get_current_admin
from app.core.limiter import limiter

router = APIRouter()


@router.post("/login", response_model=Token)
@limiter.limit("10/minute")  # Maksimal 10 percobaan login per menit per IP
async def login_admin(
    request: Request,
    db: Session = Depends(get_db),
    form_data: OAuth2PasswordRequestForm = Depends()
):
    admin = db.query(Admin).filter(Admin.username == form_data.username).first()

    if not admin or not verify_password(form_data.password, admin.password_hash):
        raise HTTPException(status_code=400, detail="Username atau password yang Anda masukkan salah")

    admin.last_login_at = datetime.utcnow()
    db.commit()

    access_token = create_access_token(subject=admin.username)
    return {"access_token": access_token, "token_type": "bearer"}


@router.post("/register", response_model=AdminResponse)
@limiter.limit("5/hour")  # Pendaftaran dibatasi ketat — 5 kali per jam per IP
async def create_superadmin(request: Request, user_in: AdminCreate, db: Session = Depends(get_db)):
    if db.query(Admin).filter(Admin.username == user_in.username).first():
        raise HTTPException(status_code=400, detail="Username tersebut sudah dipakai staf lain")

    new_admin = Admin(
        username=user_in.username,
        password_hash=get_password_hash(user_in.password)
    )
    db.add(new_admin)
    db.commit()
    db.refresh(new_admin)
    return new_admin


@router.get("/me", response_model=AdminResponse)
@limiter.limit("60/minute")
async def read_admin_me(request: Request, current_admin: Admin = Depends(get_current_admin)):
    return current_admin
