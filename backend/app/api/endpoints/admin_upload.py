from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from sqlalchemy.orm import Session
from fastapi import Depends
import shutil
import os
import uuid

from app.db.database import get_db
from app.models.domain import SystemUpdate

router = APIRouter()

UPLOAD_DIR_IMG = "uploads/images"
UPLOAD_DIR_APK = "uploads/apks"

@router.post("/upload/image")
def upload_image(file: UploadFile = File(...)):
    filename = f"{uuid.uuid4()}_{file.filename}"
    file_path = os.path.join(UPLOAD_DIR_IMG, filename)
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    # Kembalikan URL statisnya agar ditarik oleh Next.js atau Android TV
    return {"url": f"/{UPLOAD_DIR_IMG}/{filename}"}

@router.post("/upload/apk")
def upload_apk(version_name: str = Form(...), file: UploadFile = File(...), db: Session = Depends(get_db)):
    if not file.filename.endswith('.apk'):
        raise HTTPException(status_code=400, detail="Hanya ekstensi .apk yang diizinkan untuk update TV")
    
    filename = f"{uuid.uuid4()}_{file.filename}"
    file_path = os.path.join(UPLOAD_DIR_APK, filename)
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    
    # Simpan jejaknya ke Database sekalian 
    url = f"/{UPLOAD_DIR_APK}/{filename}"
    new_update = SystemUpdate(version_name=version_name, apk_url=url)
    db.add(new_update)
    db.commit()
    
    return {"message": "Berhasil merilis versi aplikasi Android TV baru", "url": url}
