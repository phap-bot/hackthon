import asyncio
import sys
from pymongo import MongoClient
from pymongo.errors import ServerSelectionTimeoutError

def test_connection():
    # Try no-auth first as it's common for local un-dockerized mongo
    uri = "mongodb://localhost:27017"
    print(f"Testing connection to {uri}...")
    try:
        client = MongoClient(uri, serverSelectionTimeoutMS=2000)
        info = client.server_info()
        print(f"Successfully connected to unauthenticated MongoDB! Version: {info.get('version')}")
        return True
    except Exception as e:
        print(f"Failed unauthenticated: {e}")

    # Try auth from docker-compose just in case
    uri_auth = "mongodb://admin:password123@localhost:27017/hackthon?authSource=admin"
    print(f"\nTesting connection to {uri_auth}...")
    try:
        client = MongoClient(uri_auth, serverSelectionTimeoutMS=2000)
        info = client.server_info()
        print(f"Successfully connected to authenticated MongoDB! Version: {info.get('version')}")
        return True
    except Exception as e:
        print(f"Failed authenticated: {e}")
        
    return False

if __name__ == "__main__":
    success = test_connection()
    if not success:
        sys.exit(1)
