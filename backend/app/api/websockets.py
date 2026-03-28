from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from typing import List

router = APIRouter()

class ConnectionManager:
    def __init__(self):
        self.active_connections: List[WebSocket] = []

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)

    def disconnect(self, websocket: WebSocket):
        self.active_connections.remove(websocket)

    async def broadcast_new_order(self):
        # Dipanggil saat klien (Android TV) POST pesanan baru
        for connection in self.active_connections:
            await connection.send_text("TING! PESANAN_BARU_MASUK")

manager = ConnectionManager()

@router.websocket("/ws/kitchen")
async def kitchen_websocket(websocket: WebSocket):
    # Layar Dapur Web Admin melakukan "konek" ke sini tanpa putus
    await manager.connect(websocket)
    try:
        while True:
            # Tetap terhubung selamanya standby jika ada order
            data = await websocket.receive_text()
    except WebSocketDisconnect:
        manager.disconnect(websocket)
