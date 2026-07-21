import redis.asyncio as aioredis
from app.config import settings


redis_client: aioredis.Redis = None


async def get_redis() -> aioredis.Redis:
    return redis_client


async def connect_redis():
    global redis_client
    redis_client = aioredis.from_url(
        settings.REDIS_URL,
        encoding="utf-8",
        decode_responses=True
    )
    try:
        await redis_client.ping()
        print("✅ Redis Connected")
    except Exception as e:
        print("❌ Redis Error:", e)


async def disconnect_redis():
    global redis_client
    if redis_client:
        await redis_client.aclose()
        print("Redis Disconnected")