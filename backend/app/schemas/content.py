from pydantic import BaseModel
from typing import Optional

# -- FACILITIES --
class FacilityBase(BaseModel):
    name: str
    description: Optional[str] = None
    image_url: Optional[str] = None

class FacilityCreate(FacilityBase): pass
class FacilityResponse(FacilityBase):
    id: str
    class Config: from_attributes = True

# -- DINING MENUS --
class DiningMenuBase(BaseModel):
    name: str
    price: float
    image_url: Optional[str] = None
    is_available: bool = True

class DiningMenuCreate(DiningMenuBase): pass
class DiningMenuResponse(DiningMenuBase):
    id: str
    class Config: from_attributes = True

# -- AMENITIES --
class AmenityBase(BaseModel):
    name: str
    description: Optional[str] = None
    image_url: Optional[str] = None

class AmenityCreate(AmenityBase): pass
class AmenityResponse(AmenityBase):
    id: str
    class Config: from_attributes = True
    
# -- INFORMATIONS --
class InformationBase(BaseModel):
    title: str
    description: Optional[str] = None
    image_url: Optional[str] = None

class InformationCreate(InformationBase): pass
class InformationResponse(InformationBase):
    id: str
    class Config: from_attributes = True

# -- ENTERTAINMENT APPS --
class AppBase(BaseModel):
    app_name: str
    package_name: Optional[str] = None
    icon_url: Optional[str] = None
    sort_order: int = 0
    is_active: bool = True

class AppCreate(AppBase): pass
class AppResponse(AppBase):
    id: str
    class Config: from_attributes = True
