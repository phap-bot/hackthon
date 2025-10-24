import asyncio
import sys
import os

# Add the backend directory to Python path
sys.path.append(os.path.join(os.path.dirname(__file__), 'backend'))

from backend.app.database import init_db, get_database, close_db

async def test_mongo_connection():
    """Test MongoDB connection"""
    try:
        print("Testing MongoDB connection...")
        
        # Initialize database
        await init_db()
        print("✅ Database connection successful!")
        
        # Get database instance
        db = get_database()
        print(f"✅ Database name: {db.name}")
        
        # Test collections
        collections = await db.list_collection_names()
        print(f"✅ Collections found: {collections}")
        
        # Test each collection
        for collection_name in collections:
            collection = db[collection_name]
            count = await collection.count_documents({})
            print(f"  - {collection_name}: {count} documents")
        
        # Test inserting a test document
        test_collection = db.test_connection
        test_doc = {"test": "connection", "timestamp": "2024-01-01"}
        result = await test_collection.insert_one(test_doc)
        print(f"✅ Test document inserted with ID: {result.inserted_id}")
        
        # Clean up test document
        await test_collection.delete_one({"_id": result.inserted_id})
        print("✅ Test document cleaned up")
        
        print("\n🎉 MongoDB connection test completed successfully!")
        return True
        
    except Exception as e:
        print(f"❌ MongoDB connection failed: {e}")
        return False
    finally:
        # Close connection
        await close_db()

if __name__ == "__main__":
    # Run the test
    result = asyncio.run(test_mongo_connection())
    if result:
        print("\n✅ MongoDB is ready!")
    else:
        print("\n❌ MongoDB connection failed!")
        sys.exit(1)
