#!/usr/bin/env python3
"""
Check preferences format
"""
import asyncio
import motor.motor_asyncio

async def check_preferences_format():
    client = motor.motor_asyncio.AsyncIOMotorClient('mongodb://localhost:27017')
    db = client['hackthon']
    
    # Get latest preferences
    latest_prefs = await db.user_preferences.find().sort('created_at', -1).limit(3).to_list(3)
    
    for i, pref in enumerate(latest_prefs, 1):
        print(f'Document {i}:')
        print(f'  Keys: {list(pref.keys())}')
        
        # Check if it's old format or new format
        if 'preferences' in pref:
            print(f'  Format: NEW (survey format)')
            print(f'  Travel Type: {pref["preferences"].get("travel_type", "N/A")}')
            print(f'  Dream Destination: {pref["preferences"].get("dream_destination", "N/A")}')
        else:
            print(f'  Format: OLD (legacy format)')
            print(f'  Travel Types: {pref.get("travel_types", [])}')
            print(f'  Dream Destinations: {pref.get("dream_destinations", [])}')
        print()
    
    client.close()

if __name__ == "__main__":
    asyncio.run(check_preferences_format())
