from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from datetime import datetime

from app.db.database import get_db
from app.models.domain import Admin
from app.schemas.auth import Token, AdminCreate, AdminResponse
from app.core.security import verify_password, get_password_hash, create_access_token, get_current_admin

router = APIRouter()

@router.post("/login", response_model=Token)
def login_admin(db: Session = Depends(get_db), form_data: OAuth2PasswordRequestForm = Depends()):
    # Cek ketersediaan username di database OSKA
    admin = db.query(Admin).filter(Admin.username == form_data.username).first()
    
    # Validasi password
    if not admin or not verify_password(form_data.password, admin.password_hash):
        raise HTTPException(status_code=400, detail="Username atau password yang Anda masukkan salah")
    
    # Perbarui rekam jejak jam login Staf
    admin.last_login_at = datetime.utcnow()
    db.commit()
    
    # Terbitkan karcis identitas (JWT Token) khusus untuk staf ini
    access_token = create_access_token(subject=admin.username)
    return {"access_token": access_token, "token_type": "bearer"}

@router.post("/register", response_model=AdminResponse)
def create_superadmin(user_in: AdminCreate, db: Session = Depends(get_db)):
    # Untuk pertama kali deploy, API ini dibiarkan terbuka agar pemilik hotel bisa register akun masternya
    if db.query(Admin).filter(Admin.username == user_in.username).first():
        raise HTTPException(status_code=400, detail="Mohon maaf, username tersebut sudah dipakai staf lain")
    
    new_admin = Admin(
        username=user_in.username,
        password_hash=get_password_hash(user_in.password)
    )
    db.add(new_admin)
    db.commit()
    db.refresh(new_admin)
    return new_admin

@router.get("/me", response_model=AdminResponse)
def read_admin_me(current_admin: Admin = Depends(get_current_admin)):
    # API ini berguna untuk Panel Next.js me-refresh data Staf yang sedang Login
    return current_admin
