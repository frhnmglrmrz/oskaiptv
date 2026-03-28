from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from app.db.database import get_db
from app.models import domain
from app.schemas import tv_schemas, content as content_schemas

router = APIRouter()

# Helper fungsi untuk mencari kamar tempat TV berada
def get_tv_room(device_id: str, db: Session):
    device = db.query(domain.Device).filter(domain.Device.device_id == device_id).first()
    if not device or not device.room_number:
        return None
    return db.query(domain.Room).filter(domain.Room.room_number == device.room_number).first()    

@router.post("/register", response_model=tv_schemas.TVRegisterResponse)
def register_tv(payload: tv_schemas.TVRegister, db: Session = Depends(get_db)):
    device = db.query(domain.Device).filter(domain.Device.device_id == payload.device_id).first()
    if not device:
        device = domain.Device(device_id=payload.device_id, device_name=payload.device_name)
        db.add(device)
        db.commit()
        db.refresh(device)
    return {"id": device.id, "registered": True}

@router.get("/home", response_model=tv_schemas.TVHomeData)
def get_tv_home(device_id: str, db: Session = Depends(get_db)):
    room = get_tv_room(device_id, db)
    
    marquee = db.query(domain.SystemSetting).filter(domain.SystemSetting.key == "marquee_text").first()
    bg = db.query(domain.SystemSetting).filter(domain.SystemSetting.key == "background_url").first()
    apps = db.query(domain.EntertainmentApp).filter(domain.EntertainmentApp.is_active == True).order_by(domain.EntertainmentApp.sort_order).all()
    
    return {
        "room_number": room.room_number if room else None,
        "guest_name": room.guest_name if room else None,
        "marquee_text": marquee.value if marquee else "Selamat Datang di OSKA Hotel!",
        "background_url": bg.value if bg else None,
        "apps": apps
    }

@router.get("/dining", response_model=List[content_schemas.DiningMenuResponse])
def get_dining_menu(db: Session = Depends(get_db)):
    return db.query(domain.DiningMenu).filter(domain.DiningMenu.is_available == True).all()

@router.post("/dining/order")
def create_dining_order(payload: tv_schemas.TVOrderCreate, db: Session = Depends(get_db)):
    room = get_tv_room(payload.device_id, db)
    if not room: raise HTTPException(status_code=400, detail="Maaf, TV Anda belum didaftarkan ke Nomor Kamar oleh Resepsionis.")
    
    total_price = sum(item.quantity * item.price_per_item for item in payload.items)
    total_items = sum(item.quantity for item in payload.items)
    
    # 1. Catat ke nota utama
    order = domain.DiningOrder(
        room_number=room.room_number,
        guest_name=room.guest_name,
        total_items=total_items,
        total_price=total_price,
        status=domain.OrderStatus.PENDING
    )
    db.add(order)
    db.commit()
    db.refresh(order)
    
    # 2. Catat ke rincian item
    for item in payload.items:
        order_item = domain.DiningOrderItem(
            order_id=order.id,
            menu_name=item.menu_name,
            quantity=item.quantity,
            price_per_item=item.price_per_item
        )
        db.add(order_item)
    db.commit()
    
    return {"message": "Pesanan Nasi Goreng/Minuman berhasil diterbangkan ke Dapur!", "order_id": order.id}

@router.get("/amenities", response_model=List[content_schemas.AmenityResponse])
def get_amenities(db: Session = Depends(get_db)):
    return db.query(domain.Amenity).all()

@router.post("/amenities/request")
def create_amenity_request(payload: tv_schemas.TVRequestCreate, db: Session = Depends(get_db)):
    room = get_tv_room(payload.device_id, db)
    if not room: raise HTTPException(status_code=400, detail="Maaf, TV belum terdaftar.")
    
    req = domain.AmenityRequest(
        room_number=room.room_number,
        guest_name=room.guest_name,
        status=domain.RequestStatus.PENDING
    )
    db.add(req)
    db.commit()
    db.refresh(req)
    
    for item in payload.items:
        req_item = domain.AmenityRequestItem(
            request_id=req.id,
            amenity_name=item.amenity_name,
            quantity=item.quantity
        )
        db.add(req_item)
    db.commit()
    
    return {"message": "Permintaan Handuk/Barang berhasil dikirim ke Housekeeping!", "request_id": req.id}

@router.get("/check-update")
def check_update(db: Session = Depends(get_db)):
    update = db.query(domain.SystemUpdate).order_by(domain.SystemUpdate.uploaded_at.desc()).first()
    if not update: return {"available": False}
    return {"available": True, "version": update.version_name, "url": update.apk_url}
