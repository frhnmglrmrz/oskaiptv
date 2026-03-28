from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from app.db.database import get_db
from app.models import domain
from app.schemas import content as schemas

router = APIRouter()

# --- FACILITIES ---
@router.get("/facilities", response_model=List[schemas.FacilityResponse])
def get_facilities(db: Session = Depends(get_db)):
    return db.query(domain.Facility).all()

@router.post("/facilities", response_model=schemas.FacilityResponse)
def create_facility(f: schemas.FacilityCreate, db: Session = Depends(get_db)):
    db_f = domain.Facility(**f.model_dump())
    db.add(db_f)
    db.commit()
    db.refresh(db_f)
    return db_f

@router.delete("/facilities/{id}")
def delete_facility(id: str, db: Session = Depends(get_db)):
    db_f = db.query(domain.Facility).filter(domain.Facility.id == id).first()
    if not db_f: raise HTTPException(status_code=404, detail="Data tidak ditemukan")
    db.delete(db_f)
    db.commit()
    return {"message": "Dihapus"}

@router.put("/facilities/{id}", response_model=schemas.FacilityResponse)
def update_facility(id: str, f: schemas.FacilityCreate, db: Session = Depends(get_db)):
    db_f = db.query(domain.Facility).filter(domain.Facility.id == id).first()
    if not db_f: raise HTTPException(status_code=404, detail="Data tidak ditemukan")
    for k, v in f.model_dump().items(): setattr(db_f, k, v)
    db.commit()
    db.refresh(db_f)
    return db_f

# --- DINING MENUS ---
@router.get("/dining", response_model=List[schemas.DiningMenuResponse])
def get_dining(db: Session = Depends(get_db)):
    return db.query(domain.DiningMenu).all()

@router.post("/dining", response_model=schemas.DiningMenuResponse)
def create_dining(d: schemas.DiningMenuCreate, db: Session = Depends(get_db)):
    db_d = domain.DiningMenu(**d.model_dump())
    db.add(db_d)
    db.commit()
    db.refresh(db_d)
    return db_d

@router.delete("/dining/{id}")
def delete_dining(id: str, db: Session = Depends(get_db)):
    db_d = db.query(domain.DiningMenu).filter(domain.DiningMenu.id == id).first()
    if not db_d: raise HTTPException(status_code=404, detail="Data tidak ditemukan")
    db.delete(db_d)
    db.commit()
    return {"message": "Dihapus"}

@router.put("/dining/{id}", response_model=schemas.DiningMenuResponse)
def update_dining(id: str, d: schemas.DiningMenuCreate, db: Session = Depends(get_db)):
    db_d = db.query(domain.DiningMenu).filter(domain.DiningMenu.id == id).first()
    if not db_d: raise HTTPException(status_code=404, detail="Data tidak ditemukan")
    for k, v in d.model_dump().items(): setattr(db_d, k, v)
    db.commit()
    db.refresh(db_d)
    return db_d

# --- AMENITIES ---
@router.get("/amenities", response_model=List[schemas.AmenityResponse])
def get_amenities(db: Session = Depends(get_db)):
    return db.query(domain.Amenity).all()

@router.post("/amenities", response_model=schemas.AmenityResponse)
def create_amenity(a: schemas.AmenityCreate, db: Session = Depends(get_db)):
    db_a = domain.Amenity(**a.model_dump())
    db.add(db_a)
    db.commit()
    db.refresh(db_a)
    return db_a

@router.delete("/amenities/{id}")
def delete_amenity(id: str, db: Session = Depends(get_db)):
    db_a = db.query(domain.Amenity).filter(domain.Amenity.id == id).first()
    if not db_a: raise HTTPException(status_code=404, detail="Data tidak ditemukan")
    db.delete(db_a)
    db.commit()
    return {"message": "Dihapus"}

@router.put("/amenities/{id}", response_model=schemas.AmenityResponse)
def update_amenity(id: str, a: schemas.AmenityCreate, db: Session = Depends(get_db)):
    db_a = db.query(domain.Amenity).filter(domain.Amenity.id == id).first()
    if not db_a: raise HTTPException(status_code=404, detail="Data tidak ditemukan")
    for k, v in a.model_dump().items(): setattr(db_a, k, v)
    db.commit()
    db.refresh(db_a)
    return db_a

# --- INFORMATIONS ---
@router.get("/informations", response_model=List[schemas.InformationResponse])
def get_informations(db: Session = Depends(get_db)):
    return db.query(domain.Information).all()

@router.post("/informations", response_model=schemas.InformationResponse)
def create_information(i: schemas.InformationCreate, db: Session = Depends(get_db)):
    db_i = domain.Information(**i.model_dump())
    db.add(db_i)
    db.commit()
    db.refresh(db_i)
    return db_i

@router.delete("/informations/{id}")
def delete_information(id: str, db: Session = Depends(get_db)):
    db_i = db.query(domain.Information).filter(domain.Information.id == id).first()
    if not db_i: raise HTTPException(status_code=404, detail="Data tidak ditemukan")
    db.delete(db_i)
    db.commit()
    return {"message": "Dihapus"}

@router.put("/informations/{id}", response_model=schemas.InformationResponse)
def update_information(id: str, i: schemas.InformationCreate, db: Session = Depends(get_db)):
    db_i = db.query(domain.Information).filter(domain.Information.id == id).first()
    if not db_i: raise HTTPException(status_code=404, detail="Data tidak ditemukan")
    for k, v in i.model_dump().items(): setattr(db_i, k, v)
    db.commit()
    db.refresh(db_i)
    return db_i

# --- ENTERTAINMENT APPS ---
@router.get("/apps", response_model=List[schemas.AppResponse])
def get_apps(db: Session = Depends(get_db)):
    return db.query(domain.EntertainmentApp).order_by(domain.EntertainmentApp.sort_order).all()

@router.post("/apps", response_model=schemas.AppResponse)
def create_app(a: schemas.AppCreate, db: Session = Depends(get_db)):
    db_a = domain.EntertainmentApp(**a.model_dump())
    db.add(db_a)
    db.commit()
    db.refresh(db_a)
    return db_a

@router.delete("/apps/{id}")
def delete_app(id: str, db: Session = Depends(get_db)):
    db_a = db.query(domain.EntertainmentApp).filter(domain.EntertainmentApp.id == id).first()
    if not db_a: raise HTTPException(status_code=404, detail="Data tidak ditemukan")
    db.delete(db_a)
    db.commit()
    return {"message": "Dihapus"}

@router.put("/apps/{id}", response_model=schemas.AppResponse)
def update_app(id: str, a: schemas.AppCreate, db: Session = Depends(get_db)):
    db_a = db.query(domain.EntertainmentApp).filter(domain.EntertainmentApp.id == id).first()
    if not db_a: raise HTTPException(status_code=404, detail="Data tidak ditemukan")
    for k, v in a.model_dump().items(): setattr(db_a, k, v)
    db.commit()
    db.refresh(db_a)
    return db_a
