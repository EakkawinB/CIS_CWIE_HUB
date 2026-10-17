#!/usr/bin/env python3
"""Test Supabase database connection"""

import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")

print("=" * 60)
print("🔍 Supabase Database Connection Test")
print("=" * 60)

if not DATABASE_URL:
    print("❌ ERROR: DATABASE_URL not found in .env file")
    exit(1)

print(f"\n📌 Database URL: {DATABASE_URL[:50]}...")

# Test 1: Try to connect using psycopg2 directly
print("\n[1/3] Testing raw psycopg2 connection...")
try:
    import psycopg2
    
    # Parse connection string
    # Format: postgresql://user:pass@host:port/database
    conn_parts = DATABASE_URL.replace("postgresql://", "").split("@")
    user_pass = conn_parts[0].split(":")
    host_db = conn_parts[1].split("/")
    host_port = host_db[0].split(":")
    
    user = user_pass[0]
    password = user_pass[1]
    host = host_port[0]
    port = int(host_port[1])
    database = host_db[1]
    
    print(f"   Connecting to: {host}:{port}/{database}")
    
    conn = psycopg2.connect(
        host=host,
        port=port,
        database=database,
        user=user,
        password=password,
        sslmode="require"
    )
    
    cursor = conn.cursor()
    cursor.execute("SELECT 1")
    result = cursor.fetchone()
    cursor.close()
    conn.close()
    
    print(f"   ✅ Connection successful! Result: {result}")
    
except Exception as e:
    print(f"   ❌ Connection failed: {type(e).__name__}: {e}")
    exit(1)

# Test 2: Check if we can query tables
print("\n[2/3] Testing table queries...")
try:
    import psycopg2
    
    conn = psycopg2.connect(DATABASE_URL, sslmode="require")
    cursor = conn.cursor()
    
    # List all tables
    cursor.execute("""
        SELECT table_name 
        FROM information_schema.tables 
        WHERE table_schema = 'public'
        ORDER BY table_name
    """)
    
    tables = cursor.fetchall()
    
    if tables:
        print(f"   ✅ Found {len(tables)} tables:")
        for table in tables:
            print(f"      - {table[0]}")
    else:
        print("   ⚠️  No tables found in public schema")
    
    cursor.close()
    conn.close()
    
except Exception as e:
    print(f"   ❌ Query failed: {type(e).__name__}: {e}")
    exit(1)

# Test 3: Check specific application tables
print("\n[3/3] Testing application tables...")
try:
    import psycopg2
    
    conn = psycopg2.connect(DATABASE_URL, sslmode="require")
    cursor = conn.cursor()
    
    app_tables = ['students', 'teachers', 'staff', 'otp_codes']
    
    for table in app_tables:
        try:
            cursor.execute(f"SELECT COUNT(*) FROM {table}")
            count = cursor.fetchone()[0]
            print(f"   ✅ {table}: {count} rows")
        except psycopg2.errors.UndefinedTable:
            print(f"   ⚠️  {table}: Not found (needs migration)")
        except Exception as e:
            print(f"   ❌ {table}: Error - {e}")
    
    cursor.close()
    conn.close()
    
except Exception as e:
    print(f"   ❌ Error checking tables: {type(e).__name__}: {e}")
    exit(1)

print("\n" + "=" * 60)
print("✅ All tests passed!")
print("=" * 60)
print("\n📝 Next steps:")
print("   1. Run migrations: alembic upgrade head")
print("   2. Start backend: uvicorn app.main:app --reload")
print("=" * 60)
