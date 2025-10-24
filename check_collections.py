#!/usr/bin/env python3
"""
Check all collections in database
"""
import asyncio
import motor.motor_asyncio

async def check_collections():
    client = motor.motor_asyncio.AsyncIOMotorClient('mongodb://localhost:27017')
    db = client['hackthon']
    
    # List all collections
    collections = await db.list_collection_names()
    print('Collections:', collections)
    
    # Check each collection
    for collection_name in collections:
        count = await db[collection_name].count_documents({})
        print(f'{collection_name}: {count} documents')
        
        if count > 0 and 'preference' in collection_name.lower():
            # Show sample document
            sample = await db[collection_name].find_one()
            print(f'Sample from {collection_name}:')
            if sample:
                print(f'  Keys: {list(sample.keys())}')
                if 'preferences' in sample:
                    print(f'  Preferences keys: {list(sample["preferences"].keys())}')
            else:
                print('  No sample found')
    
    client.close()

if __name__ == "__main__":
    asyncio.run(check_collections())
