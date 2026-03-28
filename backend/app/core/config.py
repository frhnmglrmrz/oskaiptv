import os
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "OSKA IPTV"
    # Rahasia untuk membungkus kunci JWT. Di production, wajib ditaruh di .env
    SECRET_KEY: str = os.getenv("SECRET_KEY", "oska_iptv_super_secret_key_8899")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7 # Akses staf aktif selama 7 Hari
    
    class Config:
        env_file = ".env"

settings = Settings()
