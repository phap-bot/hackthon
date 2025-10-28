from fastapi import APIRouter, WebSocket, WebSocketDisconnect
import json
from app.database import db

router = APIRouter()
active_ws = set()

@router.websocket("/ws/locations")
async def locations_socket(ws: WebSocket):
    await ws.accept()
    active_ws.add(ws)
    try:
        pipeline = [{ "$match": { "operationType": "insert" } }]
        stream = db.location_pings.watch(pipeline)
        async for change in stream:
            doc = change["fullDocument"]
            data = {
                "user_id": str(doc["user_id"]),
                "loc": doc["loc"],
                "ts": doc["ts"].isoformat()
            }
            for conn in list(active_ws):
                try:
                    await conn.send_text(json.dumps(data))
                except:
                    active_ws.remove(conn)
    except WebSocketDisconnect:
        active_ws.remove(ws)
