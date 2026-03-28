from fastapi import APIRouter, Depends, HTTPException, Request
from sqlalchemy.orm import Session
from typing import List

from app.db.database import get_db
from app.models import domain
from app.schemas import content as schemas
from app.core.limiter import limiter

router = APIRouter()

# ─── Batas umum: 60 req/menit untuk GET dan 30/menit untuk POST/DELETE ───

# --- FACILITIES ---
@router.get("/facilities", response_model=List[schemas.FacilityResponse])
@limiter.limit("60/minute")
async def get_facilities(request: Request, db: Session = Depends(get_db)):
    return db.query(domain.Facility).all()

@router.post("/facilities", response_model=schemas.FacilityResponse)
@limiter.limit("30/minute")
async def create_facility(request: Request, f: schemas.FacilityCreate, db: Session = Depends(get_db)):
    db_f = domain.Facility(**f.model_dump())
    db.add(db_f); db.commit(); db.refresh(db_f)
    return db_f

@router.delete("/facilities/{id}")
@limiter.limit("30/minute")
async def delete_facility(request: Request, id: str, db: Session = Depends(get_db)):
    db_f = db.query(domain.Facility).filter(domain.Facility.id == id).first()
    if not db_f: raise HTTPException(status_code=404, detail="Data tidak ditemukan")
    db.delete(db_f); db.commit()
    return {"message": "Dihapus"}

# --- DINING MENUS ---
@router.get("/dining", response_model=List[schemas.DiningMenuResponse])
@limiter.limit("60/minute")
async def get_dining(request: Request, db: Session = Depends(get_db)):
    return db.query(domain.DiningMenu).all()

@router.post("/dining", response_model=schemas.DiningMenuResponse)
@limiter.limit("30/minute")
async def create_dining(request: Request, d: schemas.DiningMenuCreate, db: Session = Depends(get_db)):
    db_d = domain.DiningMenu(**d.model_dump())
    db.add(db_d); db.commit(); db.refresh(db_d)
    return db_d

@router.delete("/dining/{id}")
@limiter.limit("30/minute")
async def delete_dining(request: Request, id: str, db: Session = Depends(get_db)):
    db_d = db.query(domain.DiningMenu).filter(domain.DiningMenu.id == id).first()
    if not db_d: raise HTTPException(status_code=404, detail="Data tidak ditemukan")
    db.delete(db_d); db.commit()
    return {"message": "Dihapus"}

# --- AMENITIES ---
@router.get("/amenities", response_model=List[schemas.AmenityResponse])
@limiter.limit("60/minute")
async def get_amenities(request: Request, db: Session = Depends(get_db)):
    return db.query(domain.Amenity).all()

@router.post("/amenities", response_model=schemas.AmenityResponse)
@limiter.limit("30/minute")
async def create_amenity(request: Request, a: schemas.AmenityCreate, db: Session = Depends(get_db)):
    db_a = domain.Amenity(**a.model_dump())
    db.add(db_a); db.commit(); db.refresh(db_a)
    return db_a

@router.delete("/amenities/{id}")
@limiter.limit("30/minute")
async def delete_amenity(request: Request, id: str, db: Session = Depends(get_db)):
    db_a = db.query(domain.Amenity).filter(domain.Amenity.id == id).first()
    if not db_a: raise HTTPException(status_code=404, detail="Data tidak ditemukan")
    db.delete(db_a); db.commit()
    return {"message": "Dihapus"}

# --- INFORMATIONS ---
@router.get("/informations", response_model=List[schemas.InformationResponse])
@limiter.limit("60/minute")
async def get_informations(request: Request, db: Session = Depends(get_db)):
    return db.query(domain.Information).all()

@router.post("/informations", response_model=schemas.InformationResponse)
@limiter.limit("30/minute")
async def create_information(request: Request, i: schemas.InformationCreate, db: Session = Depends(get_db)):
    db_i = domain.Information(**i.model_dump())
    db.add(db_i); db.commit(); db.refresh(db_i)
    return db_i

@router.delete("/informations/{id}")
@limiter.limit("30/minute")
async def delete_information(request: Request, id: str, db: Session = Depends(get_db)):
    db_i = db.query(domain.Information).filter(domain.Information.id == id).first()
    if not db_i: raise HTTPException(status_code=404, detail="Data tidak ditemukan")
    db.delete(db_i); db.commit()
    return {"message": "Dihapus"}

# --- ENTERTAINMENT APPS ---
@router.get("/apps", response_model=List[schemas.AppResponse])
@limiter.limit("60/minute")
async def get_apps(request: Request, db: Session = Depends(get_db)):
    return db.query(domain.EntertainmentApp).order_by(domain.EntertainmentApp.sort_order).all()

@router.post("/apps", response_model=schemas.AppResponse)
@limiter.limit("30/minute")
async def create_app(request: Request, a: schemas.AppCreate, db: Session = Depends(get_db)):
    db_a = domain.EntertainmentApp(**a.model_dump())
    db.add(db_a); db.commit(); db.refresh(db_a)
    return db_a

@router.delete("/apps/{id}")
@limiter.limit("30/minute")
async def delete_app(request: Request, id: str, db: Session = Depends(get_db)):
    db_a = db.query(domain.EntertainmentApp).filter(domain.EntertainmentApp.id == id).first()
    if not db_a: raise HTTPException(status_code=404, detail="Data tidak ditemukan")
    db.delete(db_a); db.commit()
    return {"message": "Dihapus"}
