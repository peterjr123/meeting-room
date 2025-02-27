# database.py

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app import SQLALCHEMY_DATABASE_URL

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