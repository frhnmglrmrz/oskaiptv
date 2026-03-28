from fastapi import APIRouter, Depends, HTTPException, Request
from sqlalchemy.orm import Session
from typing import List
from datetime import datetime

from app.db.database import get_db
from app.models.domain import Room, Device, SystemSetting
from app.schemas import hotel_schemas
from app.core.limiter import limiter

router = APIRouter()


@router.get("/rooms", response_model=List[hotel_schemas.RoomResponse])
@limiter.limit("60/minute")
async def get_rooms(request: Request, db: Session = Depends(get_db)):
    return db.query(Room).all()


@router.post("/rooms/{room_number}/checkin", response_model=hotel_schemas.RoomResponse)
@limiter.limit("30/minute")
async def checkin_room(request: Request, room_number: str, payload: hotel_schemas.RoomCheckIn, db: Session = Depends(get_db)):
    room = db.query(Room).filter(Room.room_number == room_number).first()
    if not room:
        room = Room(room_number=room_number)
        db.add(room)

    room.guest_name = payload.guest_name
    room.check_in_time = datetime.utcnow()
    db.commit()
    db.refresh(room)
    return room


@router.post("/rooms/{room_number}/checkout")
@limiter.limit("30/minute")
async def checkout_room(request: Request, room_number: str, db: Session = Depends(get_db)):
    room = db.query(Room).filter(Room.room_number == room_number).first()
    if room:
        room.guest_name = None
        room.check_in_time = None
        db.commit()
    return {"message": f"Kamar {room_number} berhasil di-checkout"}


@router.get("/devices", response_model=List[hotel_schemas.DeviceResponse])
@limiter.limit("60/minute")
async def get_devices(request: Request, db: Session = Depends(get_db)):
    return db.query(Device).all()


@router.put("/devices/{id}", response_model=hotel_schemas.DeviceResponse)
@limiter.limit("30/minute")
async def update_device(request: Request, id: str, payload: hotel_schemas.DeviceUpdate, db: Session = Depends(get_db)):
    device = db.query(Device).filter(Device.id == id).first()
    if not device:
        raise HTTPException(status_code=404, detail="Device TV tidak ditemukan")
    if payload.room_number is not None:
        device.room_number = payload.room_number
    if payload.device_name is not None:
        device.device_name = payload.device_name
    db.commit()
    db.refresh(device)
    return device


@router.get("/settings", response_model=List[hotel_schemas.SettingResponse])
@limiter.limit("60/minute")
async def get_settings(request: Request, db: Session = Depends(get_db)):
    return db.query(SystemSetting).all()


@router.put("/settings")
@limiter.limit("30/minute")
async def update_setting(request: Request, payload: hotel_schemas.SettingUpdate, db: Session = Depends(get_db)):
    setting = db.query(SystemSetting).filter(SystemSetting.key == payload.key).first()
    if setting:
        setting.value = payload.value
    else:
        setting = SystemSetting(key=payload.key, value=payload.value)
        db.add(setting)
    db.commit()
    return {"message": "Pengaturan berhasil diubah"}
