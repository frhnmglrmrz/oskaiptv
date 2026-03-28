from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from app.db.database import get_db
from app.models.domain import DiningOrder, AmenityRequest, SystemUpdate
from app.schemas import ops_schemas

router = APIRouter()

@router.get("/orders", response_model=List[ops_schemas.OrderResponse])
def get_live_orders(db: Session = Depends(get_db)):
    # Diurutkan dari pesanan yang masuk duluan (FIFO) untuk layar dapur
    return db.query(DiningOrder).order_by(DiningOrder.ordered_at.asc()).all()

@router.put("/orders/{id}/status", response_model=ops_schemas.OrderResponse)
def update_order_status(id: str, payload: ops_schemas.OrderUpdate, db: Session = Depends(get_db)):
    order = db.query(DiningOrder).filter(DiningOrder.id == id).first()
    if not order: raise HTTPException(status_code=404, detail="Order tidak ditemukan")
    order.status = payload.status
    db.commit()
    db.refresh(order)
    return order

@router.get("/requests", response_model=List[ops_schemas.RequestResponse])
def get_live_requests(db: Session = Depends(get_db)):
    return db.query(AmenityRequest).order_by(AmenityRequest.requested_at.asc()).all()

@router.put("/requests/{id}/status", response_model=ops_schemas.RequestResponse)
def update_request_status(id: str, payload: ops_schemas.RequestUpdate, db: Session = Depends(get_db)):
    req = db.query(AmenityRequest).filter(AmenityRequest.id == id).first()
    if not req: raise HTTPException(status_code=404, detail="Request tidak ditemukan")
    req.status = payload.status
    db.commit()
    db.refresh(req)
    return req

@router.get("/system-update", response_model=List[ops_schemas.SystemUpdateResponse])
def get_updates(db: Session = Depends(get_db)):
    return db.query(SystemUpdate).order_by(SystemUpdate.uploaded_at.desc()).all()

@router.post("/system-update", response_model=ops_schemas.SystemUpdateResponse)
def create_update(payload: ops_schemas.SystemUpdateCreate, db: Session = Depends(get_db)):
    update = SystemUpdate(version_name=payload.version_name, apk_url=payload.apk_url)
    db.add(update)
    db.commit()
    db.refresh(update)
    return update
