from fastapi import APIRouter, Depends
from app.api.endpoints import admin_content, admin_auth, admin_hotel, admin_ops, tv_client, admin_upload
from app.api import websockets
from app.core.security import get_current_admin

api_router = APIRouter()

# 1. Rute Auth DIBIARKAN TERBUKA (agar Staf bisa login)
api_router.include_router(admin_auth.router, prefix="/admin/auth", tags=["Admin Authentication"])

# 2. RUTE ADMIN SEMUA DIGEMBOK (Wajib bawa Token JWT hasil login)
secure_depends = [Depends(get_current_admin)]

api_router.include_router(admin_content.router, prefix="/admin", tags=["Admin Content CRUD"], dependencies=secure_depends)
api_router.include_router(admin_hotel.router, prefix="/admin", tags=["Admin Hotel Management"], dependencies=secure_depends)
api_router.include_router(admin_ops.router, prefix="/admin", tags=["Admin Live Operations"], dependencies=secure_depends)
api_router.include_router(admin_upload.router, prefix="/admin", tags=["Admin File Upload (Media & APK)"], dependencies=secure_depends)

# 3. RUTE TV DIBIARKAN TERBUKA (Untuk koneksi hardware Android TV offline)
api_router.include_router(tv_client.router, prefix="/tv", tags=["Public TV Client APIs"])
api_router.include_router(websockets.router, prefix="", tags=["Live WebSockets"])
