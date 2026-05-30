"""
MongoDB Atlas connection via Motor (async).
Falls back gracefully if MongoDB is unavailable.
"""
import os
from motor.motor_asyncio import AsyncIOMotorClient
from pymongo import DESCENDING
from dotenv import load_dotenv

load_dotenv()

MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017")
MONGO_DB = os.getenv("MONGO_DB", "neurocalm")

_client: AsyncIOMotorClient = None


def get_client() -> AsyncIOMotorClient:
    global _client
    if _client is None:
        _client = AsyncIOMotorClient(MONGO_URI, serverSelectionTimeoutMS=3000)
    return _client


def get_db():
    return get_client()[MONGO_DB]


async def ping_db() -> bool:
    try:
        await get_client().admin.command("ping")
        return True
    except Exception:
        return False


async def save_metrics_entry(entry: dict) -> str:
    """Save a metrics snapshot to history collection."""
    try:
        db = get_db()
        result = await db.history.insert_one(entry)
        return str(result.inserted_id)
    except Exception as e:
        print(f"[DB] Could not save metrics: {e}")
        return ""


async def get_history(user_id: str, limit: int = 30) -> list:
    """Fetch recent history for a user."""
    try:
        db = get_db()
        cursor = db.history.find(
            {"user_id": user_id},
            {"_id": 0}
        ).sort("timestamp", DESCENDING).limit(limit)
        return await cursor.to_list(length=limit)
    except Exception as e:
        print(f"[DB] Could not fetch history: {e}")
        return []
