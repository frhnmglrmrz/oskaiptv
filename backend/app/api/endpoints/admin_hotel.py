from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from datetime import datetime

from app.db.database import get_db
from app.models.domain import Room, Device, SystemSetting
from app.schemas import hotel_schemas

router = APIRouter()

@router.get("/rooms", response_model=List[hotel_schemas.RoomResponse])
def get_rooms(db: Session = Depends(get_db)):
    return db.query(Room).all()

@router.post("/rooms/{room_number}/checkin", response_model=hotel_schemas.RoomResponse)
def checkin_room(room_number: str, payload: hotel_schemas.RoomCheckIn, db: Session = Depends(get_db)):
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
def checkout_room(room_number: str, db: Session = Depends(get_db)):
    room = db.query(Room).filter(Room.room_number == room_number).first()
    if room:
        room.guest_name = None
        room.check_in_time = None
        db.commit()
    return {"message": f"Kamar {room_number} berhasil di-checkout"}

@router.get("/devices", response_model=List[hotel_schemas.DeviceResponse])
def get_devices(db: Session = Depends(get_db)):
    return db.query(Device).all()

@router.put("/devices/{id}", response_model=hotel_schemas.DeviceResponse)
def update_device(id: str, payload: hotel_schemas.DeviceUpdate, db: Session = Depends(get_db)):
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
def get_settings(db: Session = Depends(get_db)):
    return db.query(SystemSetting).all()

@router.put("/settings")
def update_setting(payload: hotel_schemas.SettingUpdate, db: Session = Depends(get_db)):
    setting = db.query(SystemSetting).filter(SystemSetting.key == payload.key).first()
    if setting:
        setting.value = payload.value
    else:
        setting = SystemSetting(key=payload.key, value=payload.value)
        db.add(setting)
    db.commit()
    return {"message": "Pengaturan berhasil diubah"}
