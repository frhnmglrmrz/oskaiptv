from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class DeviceBase(BaseModel):
    device_id: str
    device_name: Optional[str] = None
    room_number: Optional[str] = None

class DeviceUpdate(BaseModel):
    room_number: Optional[str] = None
    device_name: Optional[str] = None

class DeviceResponse(DeviceBase):
    id: str
    registered_at: datetime
    class Config: from_attributes = True

class RoomBase(BaseModel):
    room_number: str

class RoomCheckIn(BaseModel):
    guest_name: str

class RoomResponse(RoomBase):
    guest_name: Optional[str] = None
    check_in_time: Optional[datetime] = None
    class Config: from_attributes = True

class SettingUpdate(BaseModel):
    key: str
    value: str

class SettingResponse(BaseModel):
    key: str
    value: str
    class Config: from_attributes = True
