import uuid
import enum
from datetime import datetime
from sqlalchemy import Column, String, Integer, Boolean, Text, Numeric, DateTime, ForeignKey, Enum
from sqlalchemy.orm import relationship
from app.db.database import Base

def generate_uuid():
    return str(uuid.uuid4())

class OrderStatus(str, enum.Enum):
    PENDING = "PENDING"
    PREPARING = "PREPARING"
    DELIVERED = "DELIVERED"
    CANCELED = "CANCELED"

class RequestStatus(str, enum.Enum):
    PENDING = "PENDING"
    IN_PROGRESS = "IN_PROGRESS"
    COMPLETED = "COMPLETED"
    CANCELED = "CANCELED"

class Admin(Base):
    __tablename__ = "admins"
    id = Column(String(36), primary_key=True, default=generate_uuid)
    username = Column(String(50), unique=True, index=True, nullable=False)
    password_hash = Column(String(255), nullable=False)
    last_login_at = Column(DateTime, nullable=True)

class Room(Base):
    __tablename__ = "rooms"
    room_number = Column(String(20), primary_key=True)
    guest_name = Column(String(100), nullable=True)
    check_in_time = Column(DateTime, nullable=True)

class Device(Base):
    __tablename__ = "devices"
    id = Column(String(36), primary_key=True, default=generate_uuid)
    device_id = Column(String(100), unique=True, nullable=False)
    device_name = Column(String(100), nullable=True)
    room_number = Column(String(20), ForeignKey("rooms.room_number"), nullable=True)
    registered_at = Column(DateTime, default=datetime.utcnow)

class SystemSetting(Base):
    __tablename__ = "system_settings"
    key = Column(String(50), primary_key=True)
    value = Column(Text, nullable=True)

class EntertainmentApp(Base):
    __tablename__ = "entertainment_apps"
    id = Column(String(36), primary_key=True, default=generate_uuid)
    app_name = Column(String(100), nullable=False)
    package_name = Column(String(100), nullable=True)
    icon_url = Column(String(255), nullable=True)
    sort_order = Column(Integer, default=0)
    is_active = Column(Boolean, default=True)

class Facility(Base):
    __tablename__ = "facilities"
    id = Column(String(36), primary_key=True, default=generate_uuid)
    name = Column(String(100), nullable=False)
    description = Column(Text, nullable=True)
    image_url = Column(String(255), nullable=True)

class Information(Base):
    __tablename__ = "informations"
    id = Column(String(36), primary_key=True, default=generate_uuid)
    title = Column(String(100), nullable=False)
    description = Column(Text, nullable=True)
    image_url = Column(String(255), nullable=True)

class Amenity(Base):
    __tablename__ = "amenities"
    id = Column(String(36), primary_key=True, default=generate_uuid)
    name = Column(String(100), nullable=False)
    description = Column(Text, nullable=True)
    image_url = Column(String(255), nullable=True)

class DiningMenu(Base):
    __tablename__ = "dining_menus"
    id = Column(String(36), primary_key=True, default=generate_uuid)
    name = Column(String(100), nullable=False)
    price = Column(Numeric(10, 2), nullable=False)
    image_url = Column(String(255), nullable=True)
    is_available = Column(Boolean, default=True)

class DiningOrder(Base):
    __tablename__ = "dining_orders"
    id = Column(String(36), primary_key=True, default=generate_uuid)
    room_number = Column(String(20), ForeignKey("rooms.room_number"))
    guest_name = Column(String(100), nullable=True)
    total_items = Column(Integer, default=0)
    total_price = Column(Numeric(10, 2), default=0.0)
    status = Column(Enum(OrderStatus), default=OrderStatus.PENDING)
    ordered_at = Column(DateTime, default=datetime.utcnow)

class DiningOrderItem(Base):
    __tablename__ = "dining_order_items"
    id = Column(String(36), primary_key=True, default=generate_uuid)
    order_id = Column(String(36), ForeignKey("dining_orders.id"))
    menu_name = Column(String(100), nullable=False)
    quantity = Column(Integer, default=1)
    price_per_item = Column(Numeric(10, 2), nullable=False)

class AmenityRequest(Base):
    __tablename__ = "amenity_requests"
    id = Column(String(36), primary_key=True, default=generate_uuid)
    room_number = Column(String(20), ForeignKey("rooms.room_number"))
    guest_name = Column(String(100), nullable=True)
    status = Column(Enum(RequestStatus), default=RequestStatus.PENDING)
    requested_at = Column(DateTime, default=datetime.utcnow)

class AmenityRequestItem(Base):
    __tablename__ = "amenity_request_items"
    id = Column(String(36), primary_key=True, default=generate_uuid)
    request_id = Column(String(36), ForeignKey("amenity_requests.id"))
    amenity_name = Column(String(100), nullable=False)
    quantity = Column(Integer, default=1)

class SystemUpdate(Base):
    __tablename__ = "system_updates"
    id = Column(String(36), primary_key=True, default=generate_uuid)
    version_name = Column(String(50), nullable=False)
    apk_url = Column(String(255), nullable=False)
    uploaded_at = Column(DateTime, default=datetime.utcnow)
