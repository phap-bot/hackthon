from fastapi import FastAPI, HTTPException, Depends, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer
from contextlib import asynccontextmanager
import uvicorn
import os
from dotenv import load_dotenv

from app.database import init_db
from app.routers import (
    auth, 
    travel_planner, 
    itinerary, 
    feedback, 
    # feedback_management,
    # feedback_dashboard,
    admin, 
    maps,
    websocket,
    language,
    preference_survey,
    preferences
)
from app.middleware import LoggingMiddleware, RateLimitMiddleware
from app.utils.logger import setup_logger

# Load environment variables
try:
    load_dotenv()
except Exception as e:
    print(f"Warning: Could not load .env file: {e}")
    print("Using default environment variables...")

# Setup logger
logger = setup_logger(__name__)
@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan events"""
    # Startup
    logger.info("Starting AI Travel Planner API...")
    await init_db()
    logger.info("Database initialized successfully")
    
    yield
    
    # Shutdown
    logger.info("Shutting down AI Travel Planner API...")

# Create FastAPI app
app = FastAPI(
    title="AI Travel Planner API",
    description="智能旅游规划系统后端API",
    version="2.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
    lifespan=lifespan
)

# Configure JSON encoding for UTF-8
import json
from fastapi.responses import JSONResponse
from fastapi.encoders import jsonable_encoder

# Override JSON encoder to handle UTF-8 properly
import uvicorn
import sys
import os

# Set UTF-8 encoding for the entire application
if sys.platform == "win32":
    os.environ["PYTHONIOENCODING"] = "utf-8"

# CORS middleware
origins = [
    "http://localhost:3000",
    "http://localhost:3001",
    "http://localhost:3002",
    "http://localhost:3003",
    "http://localhost:3004",
    "http://localhost:3005", 
    "http://localhost:3006",
    "http://127.0.0.1:3000",
    "http://127.0.0.1:3001",
    "http://127.0.0.1:3002",
    "http://127.0.0.1:3003",
    "http://127.0.0.1:3004",
    "http://127.0.0.1:3005",
    "http://127.0.0.1:3006"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],      # Cho phép tất cả các phương thức: GET, POST, PUT, DELETE
    allow_headers=["*"],      # Cho phép tất cả headers (bao gồm Authorization)
)

# Custom middleware
app.add_middleware(LoggingMiddleware)
app.add_middleware(RateLimitMiddleware)

# Security
security = HTTPBearer()

# Include routers - Order matters! More specific routes should come first
app.include_router(auth.router, prefix="/api/auth", tags=["authentication"])
app.include_router(preferences.router, prefix="/api", tags=["preferences"])  # Move before itinerary
app.include_router(travel_planner.router, prefix="/api", tags=["travel-planner"])
app.include_router(itinerary.router, prefix="/api", tags=["itinerary"])  # Generic {trip_id} route comes last
app.include_router(feedback.router, prefix="/api", tags=["feedback"])
# app.include_router(feedback_management.router, prefix="/api", tags=["feedback-management"])
# app.include_router(feedback_dashboard.router, prefix="/api/dashboard", tags=["feedback-dashboard"])
app.include_router(admin.router, prefix="/api/admin", tags=["admin"])
app.include_router(maps.router, prefix="/api/maps", tags=["maps"])
app.include_router(websocket.router, prefix="/ws", tags=["websocket"])
app.include_router(language.router, prefix="/api/languages", tags=["language"])
app.include_router(preference_survey.router, prefix="/api/survey", tags=["preference-survey"])

# Custom JSON response with UTF-8 support
def create_json_response(content, status_code=200, headers=None):
    """Create JSON response with proper UTF-8 encoding"""
    if headers is None:
        headers = {}
    
    # Ensure UTF-8 encoding
    headers["Content-Type"] = "application/json; charset=utf-8"
    
    return JSONResponse(
        content=content,
        status_code=status_code,
        headers=headers
    )

@app.options("/{path:path}")
async def options_handler(path: str):
    """Handle all OPTIONS requests for CORS"""
    return create_json_response(
        content={},
        headers={
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Requested-With",
            "Access-Control-Max-Age": "86400",
        }
    )

@app.get("/")
async def root():
    """Root endpoint"""
    return {
        "message": "AI Travel Planner API",
        "version": "2.0.0",
        "status": "running",
        "docs": "/docs"
    }

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "timestamp": "2024-01-01T00:00:00Z"
    }

if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info"
    )
