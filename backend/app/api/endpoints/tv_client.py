from fastapi import APIRouter, Depends, HTTPException, Request
from sqlalchemy.orm import Session
from typing import List

from app.db.database import get_db
from app.models import domain
from app.schemas import tv_schemas, content as content_schemas
from app.core.limiter import limiter

router = APIRouter()


def get_tv_room(device_id: str, db: Session):
    device = db.query(domain.Device).filter(domain.Device.device_id == device_id).first()
    if not device or not device.room_number:
        return None
    return db.query(domain.Room).filter(domain.Room.room_number == device.room_number).first()


@router.post("/register", response_model=tv_schemas.TVRegisterResponse)
@limiter.limit("20/hour")  # TV baru jarang registrasi ulang — 20 kali/jam cukup
async def register_tv(request: Request, payload: tv_schemas.TVRegister, db: Session = Depends(get_db)):
    device = db.query(domain.Device).filter(domain.Device.device_id == payload.device_id).first()
    if not device:
        device = domain.Device(device_id=payload.device_id, device_name=payload.device_name)
        db.add(device)
        db.commit()
        db.refresh(device)
    return {"id": device.id, "registered": True}


@router.get("/home", response_model=tv_schemas.TVHomeData)
@limiter.limit("120/minute")  # Sync data home sering, izinkan 2 request/detik per TV
async def get_tv_home(request: Request, device_id: str, db: Session = Depends(get_db)):
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
@limiter.limit("60/minute")
async def get_dining_menu(request: Request, db: Session = Depends(get_db)):
    return db.query(domain.DiningMenu).filter(domain.DiningMenu.is_available == True).all()


@router.post("/dining/order")
@limiter.limit("30/minute")  # Maksimal 1 order per 2 detik per TV — cegah spam pesanan
async def create_dining_order(request: Request, payload: tv_schemas.TVOrderCreate, db: Session = Depends(get_db)):
    room = get_tv_room(payload.device_id, db)
    if not room:
        raise HTTPException(status_code=400, detail="TV belum terdaftar ke Nomor Kamar. Hubungi Resepsionis.")

    total_price = sum(item.quantity * item.price_per_item for item in payload.items)
    total_items = sum(item.quantity for item in payload.items)

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

    for item in payload.items:
        order_item = domain.DiningOrderItem(
            order_id=order.id,
            menu_name=item.menu_name,
            quantity=item.quantity,
            price_per_item=item.price_per_item
        )
        db.add(order_item)
    db.commit()

    return {"message": "Pesanan berhasil dikirim ke Dapur!", "order_id": order.id}


@router.get("/amenities", response_model=List[content_schemas.AmenityResponse])
@limiter.limit("60/minute")
async def get_amenities(request: Request, db: Session = Depends(get_db)):
    return db.query(domain.Amenity).all()


@router.post("/amenities/request")
@limiter.limit("20/minute")  # Permintaan barang dibatasi wajar
async def create_amenity_request(request: Request, payload: tv_schemas.TVRequestCreate, db: Session = Depends(get_db)):
    room = get_tv_room(payload.device_id, db)
    if not room:
        raise HTTPException(status_code=400, detail="TV belum terdaftar.")

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

    return {"message": "Permintaan berhasil dikirim!", "request_id": req.id}


@router.get("/check-update")
@limiter.limit("10/minute")  # TV check update saat booting — tidak perlu sering
async def check_update(request: Request, db: Session = Depends(get_db)):
    update = db.query(domain.SystemUpdate).order_by(domain.SystemUpdate.uploaded_at.desc()).first()
    if not update:
        return {"available": False}
    return {"available": True, "version": update.version_name, "url": update.apk_url}
