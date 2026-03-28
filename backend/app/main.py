from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from app.api.router import api_router

app = FastAPI(
    title="OSKA IPTV API Server",
    description="Menangani Admin Hotel Panel dan Aplikasi Client Android TV",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def health_check():
    return {
        "status": "online",
        "message": "Server FastAPI berjalan dengan arsitektur modular!"
    }

# Daftarkan jalur (gateway) khusus untuk file statis / foto
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")

# Daftarkan seluruh rute API Web Admin ke server utama
app.include_router(api_router, prefix="/api")
