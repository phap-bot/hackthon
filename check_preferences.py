#!/usr/bin/env python3
"""
Check user preferences in database
"""
import asyncio
import motor.motor_asyncio
from datetime import datetime

async def check_preferences():
    client = motor.motor_asyncio.AsyncIOMotorClient('mongodb://localhost:27017')
    db = client['hackthon']
    
    # Check user_preferences collection
    preferences_count = await db.user_preferences.count_documents({})
    print(f'Total preferences records: {preferences_count}')
    
    if preferences_count > 0:
        # Get latest preferences
        latest_prefs = await db.user_preferences.find().sort('created_at', -1).limit(5).to_list(5)
        print('\nLatest preferences:')
        for i, pref in enumerate(latest_prefs, 1):
            print(f'{i}. User ID: {pref["user_id"]}')
            print(f'   Created: {pref["created_at"]}')
            print(f'   Travel Type: {pref["preferences"].get("travel_type", "N/A")}')
            print(f'   Dream Destination: {pref["preferences"].get("dream_destination", "N/A")}')
            print()
    
    client.close()

if __name__ == "__main__":
    asyncio.run(check_preferences())
