from fastapi import APIRouter, WebSocket, WebSocketDisconnect, Depends, HTTPException, status
from typing import Dict, List, Any
import json
import asyncio
from datetime import datetime
import uuid

from app.models import WebSocketMessage, LocationUpdate
from app.database import get_database
from app.utils.auth import get_current_user_optional

router = APIRouter()

class ConnectionManager:
    def __init__(self):
        # Store active connections by user_id
        self.active_connections: Dict[str, List[WebSocket]] = {}
        # Store user locations
        self.user_locations: Dict[str, Dict[str, Any]] = {}
        # Store trip participants
        self.trip_participants: Dict[str, List[str]] = {}
    
    async def connect(self, websocket: WebSocket, user_id: str):
        """Accept a new WebSocket connection"""
        await websocket.accept()
        
        if user_id not in self.active_connections:
            self.active_connections[user_id] = []
        
        self.active_connections[user_id].append(websocket)
        
        # Send welcome message
        await self.send_personal_message({
            "type": "connection_established",
            "message": "Connected to real-time updates",
            "timestamp": datetime.utcnow().isoformat()
        }, user_id)
    
    def disconnect(self, websocket: WebSocket, user_id: str):
        """Remove a WebSocket connection"""
        if user_id in self.active_connections:
            self.active_connections[user_id].remove(websocket)
            if not self.active_connections[user_id]:
                del self.active_connections[user_id]
    
    async def send_personal_message(self, message: Dict[str, Any], user_id: str):
        """Send message to a specific user"""
        if user_id in self.active_connections:
            for connection in self.active_connections[user_id]:
                try:
                    await connection.send_text(json.dumps(message))
                except:
                    # Remove broken connection
                    self.active_connections[user_id].remove(connection)
    
    async def send_to_trip_participants(self, message: Dict[str, Any], trip_id: str, exclude_user: str = None):
        """Send message to all participants of a trip"""
        if trip_id in self.trip_participants:
            for user_id in self.trip_participants[trip_id]:
                if exclude_user and user_id == exclude_user:
                    continue
                await self.send_personal_message(message, user_id)
    
    async def broadcast_to_all(self, message: Dict[str, Any]):
        """Broadcast message to all connected users"""
        for user_id, connections in self.active_connections.items():
            for connection in connections:
                try:
                    await connection.send_text(json.dumps(message))
                except:
                    # Remove broken connection
                    self.active_connections[user_id].remove(connection)
    
    def add_trip_participant(self, trip_id: str, user_id: str):
        """Add user to trip participants"""
        if trip_id not in self.trip_participants:
            self.trip_participants[trip_id] = []
        
        if user_id not in self.trip_participants[trip_id]:
            self.trip_participants[trip_id].append(user_id)
    
    def remove_trip_participant(self, trip_id: str, user_id: str):
        """Remove user from trip participants"""
        if trip_id in self.trip_participants and user_id in self.trip_participants[trip_id]:
            self.trip_participants[trip_id].remove(user_id)
    
    def update_user_location(self, user_id: str, location_data: Dict[str, Any]):
        """Update user location"""
        self.user_locations[user_id] = {
            **location_data,
            "last_updated": datetime.utcnow().isoformat()
        }
    
    def get_user_location(self, user_id: str) -> Dict[str, Any]:
        """Get user location"""
        return self.user_locations.get(user_id, {})

# Global connection manager
manager = ConnectionManager()

@router.websocket("/connect/{user_id}")
async def websocket_endpoint(websocket: WebSocket, user_id: str):
    """WebSocket endpoint for real-time communication"""
    await manager.connect(websocket, user_id)
    
    try:
        while True:
            # Receive message from client
            data = await websocket.receive_text()
            message_data = json.loads(data)
            
            # Handle different message types
            await handle_websocket_message(websocket, user_id, message_data)
            
    except WebSocketDisconnect:
        manager.disconnect(websocket, user_id)
    except Exception as e:
        print(f"WebSocket error: {e}")
        manager.disconnect(websocket, user_id)

async def handle_websocket_message(websocket: WebSocket, user_id: str, message_data: Dict[str, Any]):
    """Handle incoming WebSocket messages"""
    message_type = message_data.get("type")
    
    if message_type == "location_update":
        await handle_location_update(user_id, message_data)
    elif message_type == "join_trip":
        await handle_join_trip(user_id, message_data)
    elif message_type == "leave_trip":
        await handle_leave_trip(user_id, message_data)
    elif message_type == "trip_message":
        await handle_trip_message(user_id, message_data)
    elif message_type == "emergency_alert":
        await handle_emergency_alert(user_id, message_data)
    else:
        await manager.send_personal_message({
            "type": "error",
            "message": "Unknown message type",
            "timestamp": datetime.utcnow().isoformat()
        }, user_id)

async def handle_location_update(user_id: str, message_data: Dict[str, Any]):
    """Handle location update from user"""
    try:
        location_data = message_data.get("data", {})
        trip_id = location_data.get("trip_id")
        
        if not trip_id:
            await manager.send_personal_message({
                "type": "error",
                "message": "Trip ID required for location update",
                "timestamp": datetime.utcnow().isoformat()
            }, user_id)
            return
        
        # Update user location
        manager.update_user_location(user_id, location_data)
        
        # Notify trip participants
        await manager.send_to_trip_participants({
            "type": "location_update",
            "data": {
                "user_id": user_id,
                "trip_id": trip_id,
                "coordinates": location_data.get("coordinates"),
                "timestamp": datetime.utcnow().isoformat()
            }
        }, trip_id, exclude_user=user_id)
        
        # Save to database
        db = get_database()
        await db.user_locations.insert_one({
            "user_id": user_id,
            "trip_id": trip_id,
            "coordinates": location_data.get("coordinates"),
            "timestamp": datetime.utcnow()
        })
        
    except Exception as e:
        await manager.send_personal_message({
            "type": "error",
            "message": f"Failed to update location: {str(e)}",
            "timestamp": datetime.utcnow().isoformat()
        }, user_id)

async def handle_join_trip(user_id: str, message_data: Dict[str, Any]):
    """Handle user joining a trip"""
    try:
        trip_id = message_data.get("data", {}).get("trip_id")
        
        if not trip_id:
            await manager.send_personal_message({
                "type": "error",
                "message": "Trip ID required",
                "timestamp": datetime.utcnow().isoformat()
            }, user_id)
            return
        
        # Add user to trip participants
        manager.add_trip_participant(trip_id, user_id)
        
        # Notify other participants
        await manager.send_to_trip_participants({
            "type": "user_joined",
            "data": {
                "user_id": user_id,
                "trip_id": trip_id,
                "timestamp": datetime.utcnow().isoformat()
            }
        }, trip_id, exclude_user=user_id)
        
        # Send current trip participants to new user
        participants = manager.trip_participants.get(trip_id, [])
        await manager.send_personal_message({
            "type": "trip_participants",
            "data": {
                "trip_id": trip_id,
                "participants": participants,
                "timestamp": datetime.utcnow().isoformat()
            }
        }, user_id)
        
    except Exception as e:
        await manager.send_personal_message({
            "type": "error",
            "message": f"Failed to join trip: {str(e)}",
            "timestamp": datetime.utcnow().isoformat()
        }, user_id)

async def handle_leave_trip(user_id: str, message_data: Dict[str, Any]):
    """Handle user leaving a trip"""
    try:
        trip_id = message_data.get("data", {}).get("trip_id")
        
        if not trip_id:
            await manager.send_personal_message({
                "type": "error",
                "message": "Trip ID required",
                "timestamp": datetime.utcnow().isoformat()
            }, user_id)
            return
        
        # Remove user from trip participants
        manager.remove_trip_participant(trip_id, user_id)
        
        # Notify other participants
        await manager.send_to_trip_participants({
            "type": "user_left",
            "data": {
                "user_id": user_id,
                "trip_id": trip_id,
                "timestamp": datetime.utcnow().isoformat()
            }
        }, trip_id, exclude_user=user_id)
        
    except Exception as e:
        await manager.send_personal_message({
            "type": "error",
            "message": f"Failed to leave trip: {str(e)}",
            "timestamp": datetime.utcnow().isoformat()
        }, user_id)

async def handle_trip_message(user_id: str, message_data: Dict[str, Any]):
    """Handle trip chat message"""
    try:
        trip_id = message_data.get("data", {}).get("trip_id")
        message = message_data.get("data", {}).get("message")
        
        if not trip_id or not message:
            await manager.send_personal_message({
                "type": "error",
                "message": "Trip ID and message required",
                "timestamp": datetime.utcnow().isoformat()
            }, user_id)
            return
        
        # Send message to all trip participants
        await manager.send_to_trip_participants({
            "type": "trip_message",
            "data": {
                "user_id": user_id,
                "trip_id": trip_id,
                "message": message,
                "timestamp": datetime.utcnow().isoformat()
            }
        }, trip_id)
        
        # Save to database
        db = get_database()
        await db.trip_messages.insert_one({
            "user_id": user_id,
            "trip_id": trip_id,
            "message": message,
            "timestamp": datetime.utcnow()
        })
        
    except Exception as e:
        await manager.send_personal_message({
            "type": "error",
            "message": f"Failed to send message: {str(e)}",
            "timestamp": datetime.utcnow().isoformat()
        }, user_id)

async def handle_emergency_alert(user_id: str, message_data: Dict[str, Any]):
    """Handle emergency alert"""
    try:
        trip_id = message_data.get("data", {}).get("trip_id")
        alert_type = message_data.get("data", {}).get("alert_type", "general")
        coordinates = message_data.get("data", {}).get("coordinates")
        
        if not trip_id:
            await manager.send_personal_message({
                "type": "error",
                "message": "Trip ID required for emergency alert",
                "timestamp": datetime.utcnow().isoformat()
            }, user_id)
            return
        
        # Send emergency alert to all trip participants
        await manager.send_to_trip_participants({
            "type": "emergency_alert",
            "data": {
                "user_id": user_id,
                "trip_id": trip_id,
                "alert_type": alert_type,
                "coordinates": coordinates,
                "timestamp": datetime.utcnow().isoformat()
            }
        }, trip_id)
        
        # Save to database
        db = get_database()
        await db.emergency_alerts.insert_one({
            "user_id": user_id,
            "trip_id": trip_id,
            "alert_type": alert_type,
            "coordinates": coordinates,
            "timestamp": datetime.utcnow()
        })
        
    except Exception as e:
        await manager.send_personal_message({
            "type": "error",
            "message": f"Failed to send emergency alert: {str(e)}",
            "timestamp": datetime.utcnow().isoformat()
        }, user_id)

@router.get("/trip/{trip_id}/participants", response_model=List[str])
async def get_trip_participants(trip_id: str):
    """Get list of participants for a trip"""
    return manager.trip_participants.get(trip_id, [])

@router.get("/user/{user_id}/location", response_model=Dict[str, Any])
async def get_user_location(user_id: str):
    """Get current location of a user"""
    return manager.get_user_location(user_id)
