from app.database import db
from datetime import datetime, timezone
from bson import ObjectId

async def update_user_location(user_id: str, lat: float, lon: float):
    doc = {
        "user_id": ObjectId(user_id),
        "loc": {"type": "Point", "coordinates": [lon, lat]},
        "ts": datetime.now(timezone.utc)
    }
    await db.location_pings.insert_one(doc)
    return True

async def get_friends_locations(user_id: str):
    user = await db.users.find_one({"_id": ObjectId(user_id)}, {"friends": 1})
    friend_ids = user.get("friends", [])
    pipeline = [
        {"$match": {"user_id": {"$in": friend_ids}}},
        {"$sort": {"ts": -1}},
        {"$group": {"_id": "$user_id", "last": {"$first": "$$ROOT"}}}
    ]
    return [i async for i in db.location_pings.aggregate(pipeline)]
