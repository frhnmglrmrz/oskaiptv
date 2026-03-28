from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime
from app.models.domain import OrderStatus, RequestStatus

class OrderUpdate(BaseModel):
    status: OrderStatus

class OrderResponse(BaseModel):
    id: str
    room_number: str
    guest_name: Optional[str] = None
    total_items: int
    total_price: float
    status: OrderStatus
    ordered_at: datetime
    class Config: from_attributes = True

class RequestUpdate(BaseModel):
    status: RequestStatus

class RequestResponse(BaseModel):
    id: str
    room_number: str
    guest_name: Optional[str] = None
    status: RequestStatus
    requested_at: datetime
    class Config: from_attributes = True

class SystemUpdateCreate(BaseModel):
    version_name: str
    apk_url: str

class SystemUpdateResponse(BaseModel):
    id: str
    version_name: str
    apk_url: str
    uploaded_at: datetime
    class Config: from_attributes = True
