from motor.motor_asyncio import AsyncIOMotorClient
from pymongo import MongoClient
import os
from typing import Optional
import logging

logger = logging.getLogger(__name__)

class Database:
    client: Optional[AsyncIOMotorClient] = None
    database = None

db = Database()

async def init_db():
    """Initialize database connection"""
    try:
        # MongoDB connection string
        mongodb_url = os.getenv("MONGODB_URL", "mongodb://localhost:27017")
        database_name = os.getenv("DATABASE_NAME", "hackthon")
        
        # Create async client
        db.client = AsyncIOMotorClient(mongodb_url)
        db.database = db.client[database_name]
        
        # Test connection
        await db.client.admin.command('ping')
        logger.info(f"Connected to MongoDB: {database_name}")
        
        # Create indexes
        await create_indexes()
        
    except Exception as e:
        logger.error(f"Failed to connect to MongoDB: {e}")
        raise

async def create_indexes():
    """Create database indexes for better performance"""
    try:
        # Users collection indexes
        await db.database.users.create_index("email", unique=True)
        await db.database.users.create_index("username", unique=True)
        
        # Trips collection indexes
        await db.database.trips.create_index("user_id")
        await db.database.trips.create_index("destination")
        await db.database.trips.create_index("start_date")
        await db.database.trips.create_index("status")
        
        # Activities collection indexes
        await db.database.activities.create_index("trip_id")
        await db.database.activities.create_index("day")
        
        # Feedback collection indexes
        await db.database.feedback.create_index("trip_id")
        await db.database.feedback.create_index("created_at")
        
        # Maps collection indexes
        try:
            await db.database.map_locations.create_index([("location", "2dsphere")])
        except Exception as e:
            logger.warning(f"Could not create 2dsphere index: {e}")
        await db.database.map_locations.create_index("category")
        
        logger.info("Database indexes created successfully")
        
    except Exception as e:
        logger.error(f"Failed to create indexes: {e}")

async def close_db():
    """Close database connection"""
    if db.client:
        db.client.close()
        logger.info("Database connection closed")

def get_database():
    """Get database instance"""
    return db.database
