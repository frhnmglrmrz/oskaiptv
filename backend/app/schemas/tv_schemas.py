from pydantic import BaseModel
from typing import Optional, List
from app.schemas.content import AppResponse, FacilityResponse, InformationResponse, AmenityResponse, DiningMenuResponse

class TVRegister(BaseModel):
    device_id: str
    device_name: Optional[str] = "Android TV"

class TVRegisterResponse(BaseModel):
    id: str
    registered: bool

class TVHomeData(BaseModel):
    room_number: Optional[str]
    guest_name: Optional[str]
    marquee_text: Optional[str]
    background_url: Optional[str]
    apps: List[AppResponse]

class TVOrderItem(BaseModel):
    menu_name: str
    quantity: int
    price_per_item: float

class TVOrderCreate(BaseModel):
    device_id: str
    items: List[TVOrderItem]

class TVRequestItem(BaseModel):
    amenity_name: str
    quantity: int

class TVRequestCreate(BaseModel):
    device_id: str
    items: List[TVRequestItem]
