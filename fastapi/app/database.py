# database.py

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from dotenv import load_dotenv
import os

load_dotenv()
# 데이터베이스 연결 URL (MySQL)
SQLALCHEMY_DATABASE_URL = os.getenv("SQLALCHEMY_DATABASE_URL")
if SQLALCHEMY_DATABASE_URL is None:
    raise Exception("environ SQLALCHEMY_DATABASE_URL is Not Found")

# 엔진 생성
engine = create_engine(SQLALCHEMY_DATABASE_URL)

# 세션 생성
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)



# Dependency (세션 관리)
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()