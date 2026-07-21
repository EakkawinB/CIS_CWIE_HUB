from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker, declarative_base

from app.config import settings


engine = create_engine(
    settings.DATABASE_URL,
    pool_pre_ping=True,
    connect_args={
        "sslmode": "require"
    }
)


SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine
)


Base = declarative_base()



def get_db():

    db = SessionLocal()

    try:
        yield db

    finally:
        db.close()



def test_connection():

    try:
        with engine.connect() as connection:

            result = connection.execute(text("SELECT 1"))

            print(
                "✅ Supabase Connected:",
                result.fetchone()
            )

    except Exception as e:

        print(
            "❌ Database Error:",
            e
        )